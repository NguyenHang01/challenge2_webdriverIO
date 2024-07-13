const { $ } = require('@wdio/globals')

const enter_flight_point = async (inputElement, searchBoxElement, searchKeyWord, expectValue) => {
    await expect(inputElement).toBeExisting();
    await inputElement.click();
    await expect(searchBoxElement).toBeExisting();
    await searchBoxElement.setValue(searchKeyWord);
    const dropdownSearchResult = await $('span.tt-dropdown-menu');
    await browser.pause(1000);

    //get all data suggestion in dropdown search result then find the expect value
    const listSearchResult = await $$('//div[@class="tt-suggestion"]');
    let actualValueCount = 0;
    let result;
    for (const divElement of listSearchResult) {
        const suggestionText = await divElement.getText();
        if ((suggestionText.indexOf(expectValue.acronym) > -1) && (suggestionText.indexOf(expectValue.detail) > -1)) {
            actualValueCount++;
            result = divElement;
        }
    }

    //Expect: have only a expect value
    expect(actualValueCount).toEqual(1);
    //Click to the expect value element
    await result.$('strong').click();
    await expect(inputElement).toHaveValue(expectValue.textDisplay);
}



const genDateString = (day, month, year)=>{
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

const enterDate = async (inputElement, day, month, year)=>{
      //If input date < current date then throw a error
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      if (inputDate < currentDate) {
          throw new Error('Input date must be greater than or equal to the current date.');
      }

      //Open the date picker
      await inputElement.click();
      const datePicker = $('div[id="ui-datepicker-div"]');
      await expect(datePicker).toBeExisting();
      const expectTitle = `Tháng ${month} ${year}`;
      const leftPicker = $('div.ui-datepicker-group.ui-datepicker-group-first');
      await expect(leftPicker).toBeExisting();

      //Click to button next in date picker unitl left picker is expect month
      while (true) {
          const titleLeftPicker = leftPicker.$('div.ui-datepicker-title');
          const titleText = await titleLeftPicker.getText();
          if (titleText === expectTitle) { break;}
          else {
              const btnNext = $('a.ui-datepicker-next.ui-corner-all')
              await btnNext.click()
          }
      }

      //Find all elements of day in the date left date picker
      await browser.pause(1000);
      const allDaysOfMonth= await leftPicker.$$('td[data-handler="selectDay"]');
      let elementExpectDay;
      for (const subElement of allDaysOfMonth) {
          const spanOfDay = await subElement.$('span.ui-datepicker-day');
          const textOfDay = await spanOfDay.getText();
          if (textOfDay===String(day)) {
              elementExpectDay = spanOfDay;
              break;
          }
      }
      //Select the elment of expect day
      await elementExpectDay.click();
      await expect(inputElement).toHaveValue(genDateString(day, month, year));
}

class HomePage {

    get inputFlightTo() {
        return $('input[name="To"]');
    }

    get inputFlightFrom() {
        return $('input[name="From"]');
    }

    get searchBoxFlightFrom() {
        return $('//*[@id="flight_search_form"]/div[1]/div[1]/div[1]/div/div[2]/div/div[2]/span/input')
    }

    get searchBoxFlightTo() {
        return $('//*[@id="to_des"]/div/div/div[2]/div/div[2]/span/input')
    }

    get inputFlightDepartureDate() {
        return $('input[id="departure_date_flight"]');
    }

    get inputFlightReturnDate() {
        return $('input[id="returning_date_flight"]');
    }

    get switchSearchCheapest(){
        return $('//*[@id="flight_search_form"]/div[2]/div[1]/label/span')
    }

    get switchSearchCheapest(){
        return $('//*[@id="flight_search_form"]/div[2]/div[1]/label/span')
    }

    get btnSearchSubmit(){
        return $('button[id="search_button"]');
    }

    async enter_flight_from(searchKeyWord, expectValue) {
        await enter_flight_point(this.inputFlightFrom, this.searchBoxFlightFrom, searchKeyWord, expectValue);
    }

    async enter_flight_to(searchKeyWord, expectValue) {
        await enter_flight_point(this.inputFlightTo, this.searchBoxFlightTo, searchKeyWord, expectValue);
    }

    async enter_flight_departure_date(day, month, year) {
        await enterDate(this.inputFlightDepartureDate,day, month, year);
    }

    async enter_flight_return_date(day, month, year) {
            await enterDate(this.inputFlightReturnDate,day, month, year);

    }

    async select_switch_search_cheapest(isEnable){
        const currentState = await $('input[name="is_search_cheapest"]').getValue();
        if((String(currentState)==='0' && !isEnable) || (String(currentState)==='1' && isEnable)){
            return 1;
        }
        else{
            await this.switchSearchCheapest.click();
        }
    }

    async click_search_button(){
        await this.btnSearchSubmit.click();
    }
}

module.exports = new HomePage();

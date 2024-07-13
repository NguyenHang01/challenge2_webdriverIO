const { expect } = require('@wdio/globals')
const HomePage = require('../test/pageobjects/home.page');
const FlightTicketListPage = require('../test/pageobjects/flight_ticket_list.page');

describe('Senario 1:', () => {


    it('Input search informations', async () => {
        const fromPoint = {
            pointName: 'Hà Nội',
            acronym: 'HAN', 
            detail: 'Sân bay Nội Bài - Hà Nội - Việt Nam',
            textDisplay: 'Hà Nội (HAN)'
        }

        const toPoint = { 
            pointName: 'Hồ Chí Minh',
            acronym: 'SGN', 
            detail: 'Sân bay Tân Sơn Nhất - Hồ Chí Minh - Việt Nam', 
            textDisplay: 'Hồ Chí Minh (SGN)' 
        }

        //Input search information in Home Page
        await browser.url(`https://www.bestprice.vn/`);
        await HomePage.enter_flight_from('HAN', fromPoint);
        await HomePage.enter_flight_to('SGN', toPoint);
        await HomePage.enter_flight_departure_date(1, 10, 2024);
        await HomePage.enter_flight_return_date(25, 1, 2025);
        await HomePage.select_switch_search_cheapest(false);
        await HomePage.click_search_button();

        //Compare search result date with search inputed informations
        const titleDeparture = await FlightTicketListPage.get_title_departure_value();
        const titleReturn = await FlightTicketListPage.get_title_return_value();
        expect(titleDeparture).toContain(`${fromPoint.pointName} ${toPoint.pointName}`);
        expect(titleReturn).toContain(`${toPoint.pointName} ${fromPoint.pointName}`);
    })

})


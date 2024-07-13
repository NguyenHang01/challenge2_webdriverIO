const { $ } = require('@wdio/globals')

class FlightTicketListPage {
    get titleDeparture(){
        return $('//*[@id="area_filter_depart"]/div[2]/div');
    }

    get titleReturn(){
        return $('//*[@id="area_filter_return"]/div[2]/div/div[1]');
    }

    async get_title_departure_value(){
        return await this.titleDeparture.getText();       
    }
    async get_title_return_value(){
        return await this.titleReturn.getText();       
    }

}

module.exports = new FlightTicketListPage();
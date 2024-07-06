import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const baseUrl: string = 'https://api.biteship.com/v1';

const headers = {
    "Accept": "application/json",
    "Referer": 'https://biteship.com/',
    "Authorization": `Bearer ${process.env.BITSHIP_BEARER_TOKEN}`
}

const getLocationToBitwiseAPI = async (input?: string, type: string = 'single', countries: string = 'ID') => {
    const data = await axios.get(baseUrl + '/maps/areas', {
        headers: headers,
        params: {
            'countries': countries,
            'input': input,
            'type': type
        }
    });
    return data.data;
}

const getTrackingDetails = async (receipt_number?: string, courier?: string) => {
    const data = await axios.get(baseUrl + `/public/trackings/${receipt_number}/couriers/${courier}`, {
        headers: {
            "Referer": 'https://biteship.com/',
            "Authorization": `Public`
        }
    });
    return data.data;
}

const getShippingPrises = async (
    origin_area_id?: string,
    destination_area_id?: string,
    couriers: string = 'gojek,jne,sicepat,anteraja,wahana,rpx,idexpress,jdl,lion,tiki,jnt,ninja,sap,pos',
    weight?: string,
    height: string = "1",
    length: string = "1",
    width: string = "1"
) => {
    const data = await axios.post(baseUrl + '/rates/couriers',
        {
            "origin_area_id": origin_area_id,
            "destination_area_id": destination_area_id,
            "couriers": couriers,
            "items": [
                {
                    "weight": weight,
                    "height": height,
                    "length": length,
                    "width": width
                }
            ]
        },
        {
            headers: headers
        }
    )
    return data.data;
}

export {
    getLocationToBitwiseAPI,
    getTrackingDetails,
    getShippingPrises
}
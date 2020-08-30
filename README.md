# Toll Fee Calculator v2.0

Calculate the total toll fee for one vehicle for one day.

# Solution

The calculator is accessible as a Node Module and through a Web API.

## Node Module

The Node Module exports the TollCalculator class that provides a method for calculating the total toll fee.

The TollCalculator is instantiated with the following parameters:

@param tollPeriods:
Defines the different time periods, from and to, during a day and the there toll fees.
json in the format [{"from": time, "to": time, "tollFee": tollFeeName},...]
time is string with the format HH:mm
tollFeeName relates to the 'name' name in tollFees json param

@param tollFees:
Defines the fees used for the different time periods.
json in the format [{"name": tollFeeName, "fee": fee },...]
tollFeeName relates to the 'tollFee' name in the tollPeriods json param
fee is the toll fee

@param tollFreeVehicles:
Defines the vehicle types that don't pay any toll fee.
json in the format [vehicleType,...]
vehicleType is the vehicle's type as string

Method: calculate
@param vehicle - the vehicle as a Vehicle object
@param dates - date and time of all passes on one day as datestring array
@return - the total toll fee for that day

## The Web API

The web API is assessable on the following address:
localhost:3000/toll-calculation

The API expects the following json:
{"vehicle": vehicleType, "tollPasses": ["YYYY-MM-DD HH:mm:ss",...]}

'vehicleType' is the string representation of the type of vehicle. Following are allowed:
car, motorbike, tractor, emergency, diplomat, foreign, military.

'tollPasses' is an array of datestring in the following format 'YYYY-MM-DD HH:mm:ss'.

The web API result is in the following format:
{
"tollFee": tollFee,
"toll_free": false,
"errorMessages": [errorString,...],
"vehicle": vehicelType,
"passes": passes
}

tollFee - The total fee for the day for the current vehicle, 0 - 60
toll_free - true/false, if the vehicle is free of toll or not
errorMessages - A array of error messages, can be an empty array if no error is present in the input
vehicle - The vehicle type as string
passes - The total number of passes the current vehicle as has done, faulty dates are not counted
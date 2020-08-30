# Toll Fee Calculator v2.0

Calculate the total toll fee for one vehicle for one day.

# Solution

The calculator is accessible as a Node Module and through a Web API.

## Node Module

The Node Module exports the TollCalculator class that provides a method for calculating the total toll fee.<br/>

The TollCalculator is instantiated with the following parameters:<br/>

@param tollPeriods:<br/>
Defines the different time periods, from and to, during a day and the there toll fees.<br/>
json in the format [{"from": time, "to": time, "tollFee": tollFeeName},...]<br/>
time is string with the format HH:mm<br/>
tollFeeName relates to the 'name' name in tollFees json param<br/>

@param tollFees:<br/>
Defines the fees used for the different time periods.<br/>
json in the format [{"name": tollFeeName, "fee": fee },...]<br/>
tollFeeName relates to the 'tollFee' name in the tollPeriods json param<br/>
fee is the toll fee<br/>

@param tollFreeVehicles:<br/>
Defines the vehicle types that don't pay any toll fee.<br/>
json in the format [vehicleType,...]<br/>
vehicleType is the vehicle's type as string<br/>

Method: calculate<br/>
@param vehicle - the vehicle as a Vehicle object<br/>
@param dates - date and time of all passes on one day as datestring array<br/>
@return - the total toll fee for that day<br/>

## The Web API

The web API is assessable on the following address:<br/>
localhost:3000/toll-calculation<br/>

The API expects the following json:<br/>
{"vehicle": vehicleType, "tollPasses": ["YYYY-MM-DD HH:mm:ss",...]}

'vehicleType' is the string representation of the type of vehicle. Following are allowed:<br/>
car, motorbike, tractor, emergency, diplomat, foreign, military.<br/>

'tollPasses' is an array of datestring in the following format 'YYYY-MM-DD HH:mm:ss'.<br/>

The web API result is in the following format:<br/>
{<br/>
"tollFee": tollFee,<br/>
"toll_free": false,<br/>
"errorMessages": [errorString,...],<br/>
"vehicle": vehicelType,<br/>
"passes": passes<br/>
}<br/>

tollFee - The total fee for the day for the current vehicle, 0 - 60<br/>
toll_free - true/false, if the vehicle is free of toll or not<br/>
errorMessages - A array of error messages, can be an empty array if no error is present in the input<br/>
vehicle - The vehicle type as string<br/>
passes - The total number of passes the current vehicle as has done, faulty dates are not counted<br/>
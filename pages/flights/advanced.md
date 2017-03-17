# Flights QSF advanced topics

Complete QSF should provide reach and intuitive experience. This can be archived by
providing additional functionality. This includes autocomplete (or auto-suggestion)
used in city/airport fields and date pickers (calendars) in fields requiring data input.
In the end, regardless of provided easing functionality, all fields of the QSF should
be validated.

> Code provided in this documentation uses 
> [Autocomplete](https://jqueryui.com/autocomplete/) and 
> [Datepicker](https://jqueryui.com/datepicker/) widgets form
> [jQuery User Interface](https://jqueryui.com) library.


## <a name="autocomplete"></a> Autocomplete

Autocomplete is a functionality with provides user suggestions using user's current
input. It works like Google search field, where when you type, search engine tries
to suggest the best answer matching your query, and displays it as a list under the
input field.

Having autocomplete for QSF is important from few reasons:
 
* Users tend to miss-spell cities or airports names.
* Users may not be aware of additional airports near requested destination.
* It allows user to configure search for all airport in the city or choose
only specific one.

The aim of autocomplete is to present user a wide offer and limit number of
errors during early phase of search.

Autocomplete for flights QSF consists of two parts: RESTful web service and client script.

### RESTful web service

This service is provided by eSky. Depending on market there are two URLs which expose this
service to customers.

Market | URL
------ | ---
EU     | https://autocomplete.eskyservices.pl
LATAM  | https://autocomplete.edestinos.com

This URL accepts GET queries, where all parameter should ba added as a [query string](https://en.wikipedia.org/wiki/Query_string),
which should consist from the following fields:

Field name | Example value | Description
---------- | ------------- | -----------
query      | lon           | User input with minimum 3 characters.
locale     | ro_RO         | Language of returned content. If content have no translation language defaults to english.

Example request with cURL:

```
curl -X POST "https://autocomplete.eskyservices.pl/?query=lon&locale=ro_RO"
```

Response example (partial):

```json
{
  "result": [
    {
      "_index": "multiports",
      "_type": "multiport",
      "_id": "lon_ro_RO",
      "_score": 111.33901,
      "_source": {
        "name": "Londra - Toate Aeroporturile",
        "code": "LON",
        "locale": "ro_RO",
        "countryCode": "gb",
        "countryName": "Marea Britanie",
        "cityCode": "lon",
        "cityName": "Londra",
        "popularity": 1000,
        "search": "Londra Anglia Marea Britanie LON",
        "suggestion": "Londra - Toate Aeroporturile, Anglia, Marea Britanie (LON)",
        "short_suggestion": "Londra - Toate Aeroporturile (LON)",
        "multiport_suggestion": "Londra, Marea Britanie",
        "suggestionWithTags": "<b>Lon</b>dra - Toate Aeroporturile, Anglia, Marea Britanie (<b>LON</b>)",
        "shortSuggestionWithTags": "<b>Lon</b>dra - Toate Aeroporturile (<b>LON</b>)",
        "multiportSuggestionWithTags": "<b>Lon</b>dra, Marea Britanie",
        "airports_data": [
          {
            "_index": "airports",
            "_type": "airport",
            "_id": "stn_ro_RO",
            "_score": 1.3685826,
            "_source": {
              "name": "Stansted",
              "code": "STN",
              "locale": "ro_RO",
              "countryCode": "gb",
              "countryName": "Marea Britanie",
              "cityCode": "LON",
              "cityName": "Londra",
              "popularity": 639,
              "search": "Stansted Londra Anglia Marea Britanie STN",
              "suggestion": "Londra, Stansted, Anglia, Marea Britanie (STN)",
              "short_suggestion": "Stansted (STN)",
              "multiports": [
                "lon"
              ],
              "location": {
                "lat": 51.885,
                "lon": 0.235
              },
              "suggestionWithTags": "<b>Lon</b>dra, Stansted, Anglia, Marea Britanie (STN)",
              "shortSuggestionWithTags": "Stansted (STN)"
            },
            "_processed": true
          },
          ...
        ]
      }
    },
    ...
  ]
}

```

Response is provided in JSON format and can be used to construct suggestion list.

### Client script

Client script is used to utilize RESTful web service. It should fetch data, eventually
process it and finally display to the user. It should also provide additional functionality
to navigate through the suggestion list.

In our case we will use ready [Autocomplete](https://jqueryui.com/autocomplete/)
widget from [jQuery UI](https://jqueryui.com) library. Below you can see the most
basic implementation.

```js
$('[name$="[a]"],[name$="[d]"]').autocomplete({
    minLength: 3,
    source: function (request, response) {
        $.get('https://autocomplete.eskyservices.pl?query=' + request.term + '&locale=en_GB')
            .then(function (data) {
                return data && data.result.map(function (entry) {
                    return entry._source.suggestion;
                })
            })
            .then(response);
    }
});
```

We are applying `autocomplete` widget to all `[name$="[a]"],[name$="[d]"]` elements,
that is all departure and arrival destination fields. We are setting two options.
`minLength: 3` tells widget to trigger suggestions when user enters at least 3 characters
(this is required by RESTful web service). To `source` we are passing a callback
function which will trigger GET request to web service, take the result and map it
to retrieve only `_source.suggestion` property from each matching result, and then pass
those values to `response`, which will display suggestions.

This simple example can be improved by:
* Using `suggestionWithTags`, which can highlight text fragments matching user input.
* Grouping airports from one city under multiport entry.

For more information please refer to the [`jQuery.get`](https://api.jquery.com/jquery.get/)
and jQuery UI [Autocomplete Widget](http://api.jqueryui.com/autocomplete/) documentation.

## <a name="date-pickers"></a> Date pickers

> **Note on HTML5 `[type=date]` inputs.** Although there is new input type in HTML5 which
> supports date and time input using native widget, we discourage you to use it, as it does
> not provide and easy way to set required by eSky date format.

Providing date picker is not mandatory, however it boosts user experience and secures
input from invalid data. The basic implementation of data picker, using jQuery UI widget
may look as follows:

```js
$('[name$="[dd]"]').datepicker({
    dateFormat: 'yy-mm-dd'
});
```

We are applying `datepicker` widget to all departure date fields: `[name$="[dd]"]`.
The only option we are passing is `dateFormat` which enforces ISO format required
by eSky.

## <a name="validation"></a> Validation

> **Why validation on client side is important?** When you omit client side validation
> (that is validation in QSF), eSky will provide validation on server side and capture
> all incorrect requests before displaying results. However this is unwanted situation
> because client is expecting feedback as soon as possible, otherwise he fills additional
> correct forms, which takes times, lowers immersion and general user experience.

Validation is a process of checking if data provided by customer is logically valid.
We cannot say if for example chosen route from A to B is valid unless we commit
a search, however we can say if A or B are proper destination names. What else can
(and should) be validated on QSF:

1. If all required fields has some value entered.
1. If departure destination is different then arrival destination in the same leg (obviously
you cannot by flight for example from London to London).
1. If date has valid ISO format. Potential error can be also mitigated by disabling
date inputs and allow to modify their values only by date picker. However this solution
has its drawbacks and should be re-considered from UX perspective.
1. If departure date of subsequent legs are not overlapping (when you select at least round trip
flight, you have to make sure that date of arrival is at least the same date as date
of departure).
1. Number of passengers is maximum 9. When infant was selected then for one infant
there must be at least one adult. Travels where there is more then 9 passengers
are considered group travels and cannot be ordered by online search.

How you conduct validation and present potential errors to the customer is up to you.
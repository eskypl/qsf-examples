# Flights QSF developer guide

## Required fields

Label | Field&nbsp;name | Expected&nbsp;value | Note
----- | --------------- | ------------------- | ----
Trip&nbsp;type | `ot` | `RoundTrip`&nbsp;<br/>`OneWay`<br/>`MultiCity` | Single choice field (`<select>` or `<input[type=radio]>`). It decides about form layout and relations between fields. Read more in **Trip type selection** section.
From | `tr[0][d]` | `String` | Name or IATA code of destination (`d`) location of the first (index `0`) flight leg. Read more in **Flight legs configuration** section.
To | `tr[0][a]` | `String` | Name or IATA code of arrival (`a`) location of the first (index Passengers leg. Read more in **Flight legs configuration** section.
Departure | `tr[0][dd]` | `Date<YYYY-MM-DD>` | ISO format: YYYY-MM-DD.
Adult | `pa` | `Number<1...9>` | There can be maximum 9 travelers.
Youth | `py` | `Number<0...9>` |
Child | `pc` | `Number<0...9>` |
Infant | `pi` | `Number<0...4>` | Each infant needs at least one adult person, so in practice there can be no more then 4 infants.
Ticket&nbsp;class | `sc` | `economy`<br/>`economy-premium`<br/>`business`<br/>`first` |
Partner&nbsp;ID | `partner_id` | `String` | Hidden field with `PARTNER_ID` assigned by eSky.

### Trip type selection

QSF can be used to search for 3 types of flight: 
1. **One way**: flight from A to B.
1. **Round trip**: flight from A to B and then back from B(C) to A(D).
1. **Multi-city**: flight from A to B, then from C to D, then from E to F, etc.

Selecting on of the above types, changes behavior of `tr` field, which is described in next section.

> **You don't have to implement all trip types.** Most likely you will wont to omit `MultiCity`
> as it is most difficult to implement because of space required by it to display, and most complex
> validation rules.

### Flight legs configuration

> **What's a leg?**
> We call a leg a travel route between two destinations. Flight may be composed with one or more legs. One way
> travel has one leg, where round trip has two legs. Multi-city travel can be composed from minimum 2 legs, up to 4 legs maximum.

Flight legs configuration is set by `tr` field. This field has two sub-indexes given in square brackets. First index is a number of leg (counting from 0 to 3). Second index is field name. It can take 3 values:
`d` for departure field;
`a` for arrival field;
`dd` for departure date field;
Depending on chosen trip type value, following fields should be send to the eSky:

`ot` value | `tr`&nbsp;fields&nbsp;setup | Note
--------- | ----------- | ----
`OneWay` | `tr[0][d]`<br/>`tr[0][a]`<br/>`tr[0][dd]` |
`RoundTrip` | `tr[0][d]`<br/>`tr[0][a]`<br/>`tr[0][dd]`<br/><br/>`tr[1][d]`<br/>`tr[1][a]`<br/>`tr[1][dd]` | Round trip consists of two legs, where `tr[1][d]` equals `tr[0][a]` and `tr[1][a]` equals `tr[0][d]`. This is just reverse trip direction of first leg, and can be calculated automatically, so for the second leg, user should be required to specify departure date only.
`MultiCity` | `tr[0][d]`<br/>`tr[0][a]`<br/>`tr[0][dd]`<br/><br/>`tr[1][d]`<br/>`tr[1][a]`<br/>`tr[1][dd]`<br/><br/>`tr[2][d]`<br/>`tr[2][a]`<br/>`tr[2][dd]`<br/><br/>`tr[3][d]`<br/>`tr[3][a]`<br/>`tr[3][dd]` | All fields with index 0 and 1 are required for this trip type. Leg 2 and 3 are optional, however when added, then all fields for given leg are required. Legs have to be numbered in order, so for example there cannot be `tr[3]` without `tr[2]`.

### Passengers configuration

There are 4 fields describing configuration of passengers. All fields should be numbers, however their combination must match following rules:
1. At least one passenger should be selected.
1. There can be maximum 9 passengers in total. Larger number will trigger group travel form on eSky.pl side.
1. There can not be more infants than adult passengers.

## Form submission

While submitting search form, there are two important parameters that should be set. First
on is `partner_id` parameter, which can be placed as an `<input type="hidden">` tag. Value of this attribute
will be provided by eSky.

Second important parameter is set in form's `action` attribute. In this attribute you should provide
an URL to the search results. Depending on market, you should use adequate domain for you nationality.
 
Country | `action` URL
------- | --------------------------------------------
BG      | https://www2.esky.bg/flights/select
BR      | https://www2.edestinos.com.br/flights/select
CZ      | https://www2.esky.cz/flights/select
HU      | https://www2.esky.hu/flights/select
PL      | https://www2.esky.pl/flights/select
PT      | https://www2.edestinos.com.pt/flights/select
RO      | https://www2.esky.ro/flights/select
SK      | https://www2.esky.sk/flights/select
TR      | https://www2.esky.com.tr/flights/select

Form should be submitted with using `GET` method. 

### Validation

Before submitting form, it should be always validated. Sending form without proper validation
may lead to lowered conversion rate. 

## Code example

> Code below is simplified to provide general outlook how parameters described above can be placed in HTML.
> For more comprehensive example please look inside "example" folder.

```html
<form method="get" action="https://www2.esky.pl/flights/select">
    <select name="ot">
        <option value="RoundTrip">Round trip</option>    
        <option value="OneWay">One way</option>    
        <option value="MultiCity">Multi-city</option>    
    </select>
    
    <fieldset>
        <legend>Leg #1</legend>
        <label>From: <input name="tr[0][d]"/></label>
        <label>To: <input name="tr[0][a]"/></label>
        <label>Departure: <input name="tr[0][dd]" type="date"/></label>
        <label>Return: <input name="tr[1][dd]" type="date"/></label>
    </fieldset>
    
    <fieldset>
        <legend>Passengers</legend>
        <label>Adult:
            <select name="pa">
                <option>0</option>
                <option selected>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
            </select>
        </label>
        <label>Youth:
            <select name="py">
                <option selected>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
            </select>
        </label>         
        <label>Child:
            <select name="pc">
                <option selected>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
            </select>
        </label>
        <label>Infant:
            <select name="pi">
                <option selected>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
            </select>
        </label>                     
    </fieldset>
    
    <fieldset>
        <legend>Options</legend>
        <label>Ticket class:
            <select name="sc">
                <option selected>economy</option>
                <option>economy-premium</option>
                <option>business</option>
                <option>first</option>
            </select>
        </label>
    </fieldset>

    <input type="hidden" name="partner_id" value="YOUR_PARTNER_ID"/>
    
    <button type="submit">Search</button>
</form>
```
# foundry-vtt-trading-module
A Foundry VTT module meant for the Swords and Sandals campaign to aid the GM in trading

This module is based on the
[Swords and Sandals trade rules](https://docs.google.com/document/d/1966zTznHfnMFizDKmdD5AQ4OTRHjLcSr7HFTC5rDpFE).

## Installation

Watch this spot

## How to use it

### Setup

In order to start using the Swords and Sandals trading helper, a little setup is in order.

#### Trade goods

First, we need to add the trade goods and their base values into foundry.

Open the **Game Settings** and then click **Configure Settings**.
Choose the Swords and Sandals Trading Helper from the menu on the left, and you will be presented
with three configuration options. Choose **Configure Base Values** to open the editor.

To create a trade good, click the **Create trade good** button, then enter the name and the value.
The trading helper is currency agnostic, so just enter the numeric value for the trade good.

When finished, click the check mark, and the trade good is ready to go. Add as many as your heart
desires.

While the value can be changed after a trade good is created, the name cannot. If you make a
mistake, you will have to delete it and recreate it.

#### Cities

Next, we need to add all of the cities in the world.

Similar to before, this can be done from the trading helper's **Configure Settings** menu.
Choose **Configure Cities** to open the editor.

Just like before, click the **Create city** button to add a new city. Once it has a name, click the check
to confirm, and the city is ready.

#### Trade goods by city

Once all of the trade goods and cities have been defined, you need to create trade good/city 
pairings. These define the supply and demand at each city. 

At the top of the menu is a city selector. Selecting a city shows all of the existing trade goods
in it, and allows you to add new ones. 

There are two ways to add trade goods to each city. 

1. Use the **Auto create goods** button to add all trade goods to a city
  * As the name implies, this adds all defined trade goods to a city with default supply and demand
    values.
1. Use the **Create trade good** button to add trade goods one by one
  * This adds an empty trade good, for which the name can be defined.

### Using the trading helper

The trading helper is available to anyone with the GM role. It lives under the notes control on
the left side of Foundry. 

#### Overview

The overview tab shows all the trade good info for a city: base value, supply, and demand.

#### Gather rumors

The gather rumors tab automates the GM roll and check to determine whether the rumors players
have gathered are accurate.

#### Buy/sell

The buy/sell tab calculates the buy or sell price for a given trade good at a specified city.
It factors in the supply, demand, and player's diplomacy roll.

## References

This module would not have been possible without this
[fantastic guide](https://hackmd.io/@akrigline/ByHFgUZ6u/%2FF4CFuxqZSTOcqgixEf9M6A)
by Andrew Krigline.

This module uses the GitHub action to package releases included in the
[FoundryVTT-Module-Template repo](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template)

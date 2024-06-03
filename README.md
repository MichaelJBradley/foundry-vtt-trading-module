# Swords and Sandals Trading Helper

A Foundry VTT module meant for the Swords and Sandals campaign to aid the GM in trading.

This module is based on the
[Swords and Sandals trade rules](https://docs.google.com/document/d/1966zTznHfnMFizDKmdD5AQ4OTRHjLcSr7HFTC5rDpFE).

While this was built for a specific Pathfinder 1 campaign, it is system independent and could be
used alongside anything.

## Installation

The Swords and Sandals trading helper can be installed using the following link to the latest
manifest.

```
https://github.com/MichaelJBradley/foundry-vtt-trading-module/releases/latest/download/module.json
```

On the Foundry setup page, click **Add-on Modules**

Click **Install Module**, then paste the link at the bottom of the popup next to **Manifest URL**

See 
[Foundry's official documentation](https://foundryvtt.com/article/modules/)
for more info.

## How to use it

### Setup

In order to start using the Swords and Sandals trading helper, a little setup is in order.

#### Trade goods

First, we need to add the trade goods and their base values into foundry.

Open the **Game Settings** and then click **Configure Settings**.
Choose the Swords and Sandals Trading Helper from the menu on the left, and you will be presented
with configuration options. There are a lot, but we only need to focus on the first three for now.

Choose **Configure Base Values** to open the editor.

To create a trade good, click the **Create trade good** button, then enter the name and the value.
The trading helper is currency agnostic, so just enter the numeric value for the trade good.

When finished, click the check mark, and the trade good is ready to go. Add as many as your heart
desires.

While the value can be changed after a trade good is created, the name cannot. If you make a
mistake, you will have to delete it and recreate it.

#### Cities

Next, we need to add all of the cities in the world. Similar to before, this can be done from the 
trading helper's **Configure Settings** menu.

Choose **Configure Cities** to open the editor.

Just like before, click the **Create city** button to add a new city. Once it has a name, click 
the check to confirm, and the city is ready.

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
the left side of Foundry and is denoted with a moneybag.

#### Overview

The overview tab shows all the trade good info for a city: base value, supply, and demand.

#### Gather rumors

The gather rumors tab automates the GM roll and check to determine whether the rumors players
have gathered are accurate.

In order to execute rumor gathering, select a city and trade good and then enter the player's
diplomacy roll result.

Click **Roll rumor accuracy**, and the module performs a d100 GM roll to determine the accuracy.
The helper displays the results below, along with how they were reached.
If the rumors were inaccurate, it generates a random supply and demand for convenience.

By default, it also posts a message to the chat with player facing results.
Those being city, trade good, demand, and supply. The message provides no indication as to whether 
the results are reliable.

#### Buy/sell

The buy/sell tab calculates the buy or sell price for a given trade good at a specified city.
It factors in the supply, demand, and player's diplomacy roll.

In order to calculate the buy or sell price, select a city and trade good, enter the 
player's diplomacy roll result, and choose whether this is a buy or sell calculation.

Click **Get price per unit**, and the module calculates the buy or sell price for the given trade
good modified by the supply, demand, and diplomacy roll.

By default, it also posts a message to the chat with player facing results.
Those being city, trade good, and price.

## Settings

The Swords and Sandals trading helper has a number of settings to customize the behavior of the
module. Each setting has a brief description in Foundry, but they are also described here for 
convenience.

* **Configure base values:** Set up trade goods and their base values. See the
  [Setup trade goods](#trade-goods)
  section for more info.
* **Configure cities:** Set up cities. See the [Setup cities](#cities) section for more info.
* **Configure trade goods:** Set up trade goods by city to define supply and demand. See the
  [Setup trade goods by city](#trade-goods-by-city) section for more info.
* **Currency:** Define the currency to display in buy/sell results. This is only used for display
  purposes and does not affect how the module calculates prices.
* **Gather rumors accuracy:** Define the base accuracy percentage for the gather rumors roll. This
  should be a whole number, and it represents the percent chance a rumor is accurate if the player 
  rolled exactly the DC on their diplomacy check.
* **Gather rumors diplomacy DC:** Define the diplomacy check DC for gathering rumors. This modifies
  the accuracy percentage of gathering rumors by 1 point every 1 higher or lower the player's roll 
  result is than the DC.
* **Post gather rumors results:** Whether to post gather rumors results to the chat for players to
  see.
* **Buy/Sell diplomacy DC:** Define the diplomacy check DC for buying or selling. This modifies the
  buy or sell price by 1 percent for every 1 higher or lower the player's roll result is than the 
  DC.
* **Post buy/sell results:** Whether to post buy or sell results to the chat for players to see.

## References

This module would not have been possible without this
[fantastic guide](https://hackmd.io/@akrigline/ByHFgUZ6u/%2FF4CFuxqZSTOcqgixEf9M6A)
by Andrew Krigline.

This module uses the GitHub action to package releases included in the
[FoundryVTT-Module-Template repo](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template)

# Team Combiner

https://team-combiner.web.app/

Team Combiner is created for RSC bubble league to help managers and coaches to generate all possible roster combinations for a given team during a preseason.

Team Combiner generates all possible roster combinations from a list of players, filters the combinations based on team cap and locked players, sorts the combinations, and updates the state.

It starts by generating all possible roster combinations of the given player list and desired roster size using a recursive function. This produces all permutations of players taken rosterSize at a time.

Next, it filters the roster combinations in two steps:

It removes rosters that exceed the teamCap by summing the cmv values of each player and comparing to the cap.

It checks which players are "locked" and only keeps rosters that contain all locked players.

This results in a filtered list of roster combinations that meet the cap limit and contain the locked players.

The code then maps the filtered rosters to objects containing the player data and total cmv value. It sorts these objects by cmv in descending order.

Finally, it updates the possibleRosters state with the sorted roster combinations.

Whenever the player list or teamCap changes, it re-runs this logic to recalculate the possible rosters.

It also handles initializing the players state from query parameters if present.

In summary, this code generates, filters, sorts, and sets the possible team roster combinations based on the provided players, roster size, and team cap constraints. The key steps are the recursive permutation generation, filtering, and sorting the roster combinations to produce the optimized output list of options.

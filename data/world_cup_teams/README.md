# Curated FIFA World Cup Teams & Player Rosters (1950–2026)

This directory contains **190 elite and historic World Cup squads** spanning 1950 to 2026.

The pool has been intentionally curated to eliminate generic, low-rated filler squads while preserving:
1. **The Heavyweight Giants (All Editions):** Every single tournament squad for Brazil, Argentina, Germany / West Germany, Italy, France, England, Spain, Netherlands, Uruguay, and Portugal (ensuring star-studded rosters like Argentina 2018 with Messi & Di María, Italy 2014 with Chiellini & Bonucci, France 2002 with Zidane & Henry, etc. are always playable).
2. **Peak Legendary Talisman Squads:** Specific tournament editions where an all-time legend had their defining World Cup performance (e.g. Soviet Union 1958 & 1966 with Lev Yashin, Hungary 1954 with Ferenc Puskás, Bulgaria 1994 with Hristo Stoichkov, Romania 1994 with Gheorghe Hagi, Peru 1970 with Teófilo Cubillas, Colombia 2014 with James Rodríguez, Denmark 1986/1998 with the Laudrup brothers, Poland 1974/1982 with Lato & Boniek, Czechoslovakia 1962 with Josef Masopust).
3. **Historic World Cup Underdog & Cinderella Runs:** The greatest upset stories in tournament history (e.g. Morocco 2022 Semi-Finalists, Croatia 1998/2018/2022, South Korea 2002 4th Place, Turkey 2002 3rd Place, Cameroon 1990 with Roger Milla, Senegal 2002, Ghana 2010, Costa Rica 2014 with Keylor Navas, Sweden 1958/1994, Belgium 1986/2018, Nigeria 1994/1998, and Cape Verde 2026).
4. **Complete Roster Data:** Every team file includes all 22–26 squad members, verified positions (natural & secondary), form-based OVRs (1–100 scale), roles, goals, tournament awards, legend seals, and individual historical rating rationales.

> [!NOTE]
> The full, unpruned raw archive of all 494 qualified World Cup squads from 1950 to 2026 is preserved in `data/world_cup_teams_all_494/`.

## Curated Pool Breakdown

| Category | Nations Included | Editions Included |
| :--- | :--- | :--- |
| **Tier 1 Heavyweight Giants** | Brazil, Argentina, Germany / West Germany, Italy, France, England, Spain, Netherlands, Uruguay, Portugal | **All 1950–2026 appearances** |
| **Peak Legend Talismans** | Soviet Union (1958, 1966 - Lev Yashin), Hungary (1954 - Puskás/Kocsis), Bulgaria (1994 - Stoichkov), Romania (1994 - Hagi), Peru (1970 - Cubillas), Colombia (2014 - James), Denmark (1986, 1998 - Laudrups), Poland (1974, 1982 - Lato/Boniek), Czechoslovakia (1962, 1990 - Masopust/Skuhravý) | **Selected prime tournaments** |
| **Iconic Underdogs & Dark Horses** | Morocco (2022), Croatia (1998, 2018, 2022), South Korea (2002), Turkey (2002), Cameroon (1990), Senegal (2002), Ghana (2010), Costa Rica (2014), Sweden (1958, 1994), Belgium (1986, 2018), Nigeria (1994, 1998), Mexico (1986, 1998), United States (2002, 2026), Chile (1962), Austria (1954), Northern Ireland (1958), Cape Verde (2026) | **Cinderella & breakthrough editions** |

## Data Schema per Team File (`[Team]_[Year].json`)

```json
{
  "teamName": "Cape Verde",
  "teamCode": "CPV",
  "year": 2026,
  "tournament": "2026 FIFA Men's World Cup",
  "hostCountry": "United States, Canada, Mexico",
  "achievement": "2026 World Cup Underdogs (Tubarões Azuis)",
  "finalPosition": null,
  "tacticalFormation": "4-3-3",
  "squadSize": 23,
  "averageOvr": 80,
  "players": [
    {
      "id": "cape_verde-2026-ryan_mendes",
      "identityId": "identity-2026-ryan_mendes",
      "squadNumber": 10,
      "name": "Ryan Mendes",
      "positionCategory": "forward",
      "naturalPositions": ["RW"],
      "secondaryPositions": ["LW", "ST", "CF"],
      "ovr": 84,
      "role": "Key Starter",
      "matchesStarted": 5,
      "matchesSub": 0,
      "goals": 2,
      "awards": ["All-Time Caps & Goals Record Holder", "National Captain"],
      "hasLegendSeal": true,
      "legendSealReason": "Cape Verde All-Time Greatest Player & National Icon",
      "ratingRationale": "Rated 84 OVR for 2026 World Cup form with Cape Verde. Undisputed team captain and talismanic forward."
    }
  ]
}
```

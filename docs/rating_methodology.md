# Historical Football Draft - Player Rating & Legend Seal Methodology

## 1. Scope and Objective
The rating system scores a player's **historical performance and form specifically within the documented tournament edition (National Teams) or club season (Clubs)**. It does not measure career longevity, lifetime reputation, commercial popularity, or general "all-time" status.

## 2. Rating Scale (1–100 OVR)
The overall rating (OVR) is an integer strictly bounded between 1 and 100:

- **96–99: Historic All-Time Peak Performances**
  Reserved for single-tournament or single-season performances that redefined football history and carried their team to the title (e.g., Diego Maradona in World Cup 1986 [98], Pelé in World Cup 1970 [97], Lionel Messi in World Cup 2022 [97] & 2008-09 [96], Johan Cruyff in World Cup 1974 [96] & Ajax 1971-72 [96], Zinedine Zidane in World Cup 1998 [95] & Real Madrid 2001-02 [95]).
- **90–95: World-Class / Tournament Best XI Tier**
  Key protagonists, tournament best XI members, Golden Boot contenders, and defensive pillars of championship-winning teams (e.g., Jairzinho 1970 [94], Iniesta 2010 [94], Xavi 2010 [94], Beckenbauer 1974 [95], Ronaldo 2002 [95], Ronaldinho 2002 [93], Baresi 1988-89 [94], Maldini 1988-89 [93], Modric 2018 [93], Henry 2003-04 [95], Kaka 2006-07 [95], Haaland 2022-23 [94], De Bruyne 2022-23 [94]).
- **85–89: International Class / Key Starting XI**
  Consistent starters who executed tactical roles at an elite level throughout the campaign.
- **80–84: Solid Starting Players / Tactical Specialists**
  Crucial role players, defensive stoppers, and reliable contributors in disciplined systems (e.g., Greece 2004 starters like Zagorakis [85], Seitaridis [83], Dellas [84], Charisteas [82]).
- **70–79: Squad Members / Rotation Players**
  Squad players who made limited appearances or filled tactical gaps.

## 3. Position Eligibility & Tactical Roles
Every player record defines:
- **Natural Positions**: The position(s) predominantly occupied in the starting tactical formation during the edition.
- **Secondary Positions**: Verified positions played during the campaign or documented in tactical analysis archives (e.g., Ruud Gullit eligible as CF, CAM, and CM; Lothar Matthäus as CDM, CM, and CB/Sweeper; Philipp Lahm as RB, LB, and CDM).
- **Secondary-position effectiveness penalties**: Preserved as disabled per specification until a match-engine module explicitly models tactical familiarity.

## 4. Golden Legend Seal
The **Golden Legend Seal** is a distinct historical honor awarded strictly based on primary historical evidence of an extraordinary, documented individual performance during the edition.
It is **not** an automatic OVR stat boost.

### Qualification Criteria:
1. FIFA World Cup Golden Ball (Best Player) or Golden Boot (Top Scorer with decisive impact).
2. UEFA European Championship Player of the Tournament.
3. Ballon d'Or or UEFA Club Footballer of the Year corresponding directly to the winning club season.
4. Man of the Match in the Final / decisive knockout heroics documented in official match reports.
5. Official tournament all-star team inclusion with iconic status.

Every Golden Legend Seal requires a verified citation in the source ledger explaining the exact award and justification.

## 5. Review & Approval Protocol
- **Methodology Version**: `v1.0.0-verified-historical`
- Every record has a designated reviewer, verification date, and verification status (`verified`, `partially_verified`, `pending_research`).
- Only records marked `verified` are eligible for the competitive draft pool.


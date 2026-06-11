# Tournament Registration

Create route src/routes/tournament/[id]/register from scratch as follows:



## Header
    Create a read-only header section with the name, location, date and time for the tournament T corresponding to [id]

## Select-Player component

A select-player-component is a frontend component which selects a player (P) from the database.  It maintains as state SP.id (the selected players id) and SP.name (the selcted players full name) 
The select-player-component autocompletes to select a player P by regular expression match on player name or email.

## Select-Registration component

The select-registration component selects a registation (R) from the  database.
The select-registration component has two select-player components, P1 and P2.
The select-registration component has state 
- SR.new
    -- defaults to True.
    -- Set to False whenever a Registration is selected from the database.
- SR.p1Id 
- SR.p1Name
- SR.p2Id
- SR.p2Name

### Action Buttons

The select-registration component has a set of action buttons.
- "ADD" 
    - enabled: SR.new is true and SR.P1.id is not empty.
    - action: 
        - add new registration (SR.P1.id, SR.P2.id, T) to database.
        - set SR, SR.P1, SR.P2 state to default.
- "CLEAR"
    - enabled: SR.new is false
    - action:clear SR.p1Id, SR.p2Id, SR.P1, SR.P2
- "DELETE"
    - enabled: SR.new is false and SR.P1.id == SR.p1Id and SR.P2.id == SR.p2Id
    - action: delete registration (SR.P1.id, SR.P2.id, T) from database.
- "SPLIT"
    - enabled: SR.new is false and SR.P1.id == SR.p1Id and SR.P2.id == SR.p2Id and SR.p2Id is not empty
    - action: 
        update registration (SR.P1.id, none, T) from database.
        add registration (SR.P2.id, none, T) to database and data table

Whenever the database is updated, update the data table

## Data Table

After the select-registration component is a data table for all the partnerships in the current tournament.
Use the same conventions as used for the players data table in src/routes/players/+page.svelte
The table will have data columns for p1.id, p1.name, p2.id p2.name.
Columns p1.id and p2.id will be hidden.
If any row in the table is selected, copy the contents of that row to the corresponding fields in the 
select-player and select-registration states and set SR.new to false.

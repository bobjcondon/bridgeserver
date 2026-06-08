# Tournament Registration

## Part 1
In the route src/routes/tournaments, modify the actions column as follows:

If the tournament is closed, include a "results" action which links to the src/routes/tournaments/id] route.
If the tournament is open (i.e. !closed) include a "signup" action which links to the src/routes/tournaments/[id]/register route.
If a user with user.role in {ADMIN, DIRECTOR}, include the current edit and delete actions.

## Registration Table

Modify the route src/routes/tournaments/[id]/register as follows

- Create a header section with the name, location, date and time.
- Create input fields "Player 1", "Player 2"
- Create a data table with data columns Player1.name, Player2.name for all partnerships in the current tournament.
    - If a row is selected, populate the input fields with Player1.name and Player2.name.
- Autocomplete input fields:
    - After  user types a few characters in either field Player1 or Player2, attempt to autocomplete
    - use the field data to find the set, S, of players who match (by regular expression) the name or email of the input field.
   If there is a single match, autocomplete it.   
   If there are a few matches, give a pulldown menu offering a set of autocomplete choices.

- When Player1 is entered, if a registation exists for this player and this tournament, make that row visible at the top of the table.

- Next to the Player1 and Player2 entry fields are a set of entry buttons.   
- The buttons depend on state of Player1 and Player2's registration.
    - Case: Player1 and Player2 are registered in the same partnership
        -Buttons: Split, Delete
    - Case: Neither Player 1 nor Player2 registered for a partnership
        - Buttons: Add
    - Default - Button: TBD

The "Add" action adds a new partnership for Player1, Plaeyer2 for this tournament.
The "Delete" action deletes the partnership for Player1, Plaeyer2 for this tournament.
The "Split" action removes Player2 from Player1's registration and adds a new registration for Player2 (with an empty second partner).
The "TBD" action prints the information message "Not yet implemented."

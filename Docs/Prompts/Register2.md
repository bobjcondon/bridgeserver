# Tournament Registration

Create route src/routes/tournament/[id]/register from scratch as follows:



## Header
    Create a read-only header section with the name, location, date and time for the tournament T corresponding to [id]

## Player-Input field

A player-input field is a frontend component which selects players from the database.
The player-input field autocompletes to select a player P by regular expression match on player name or email.


## The New Registration section

The NewRegistration section has a subtitle "Register new Partnership"
The NewRegistration section has 2 player-input fields (NP1 and NP2) and an action button.
When a valid NP1 is entered, the action button ("Add") is activated.  If pressed, it adds a new registration to 
the registrations table.

## The Existing Registration section

The ExistingRegistration section has a subtitle "Modify existing registrations" 
The ExistingRegistration section has 2 player-input fields (EP1 and EP2).
When EP1 is entered, search the database to find a registration R s.t. R.p1 == EP1 or R.p2 == EP the two input fields are updated to reflect the registration (R) associated with EP1.
Signal an error if EP1 does not participate in a registration.

If R is a complete registration (R.p2 is not empty), action buttons are "Delete" and "Split".
EPressing "Delete" deletes the registration R.   
EPressing "Split" adds a new registration, NR, such that NR.EP1 = R.EP2, NR.EP2 = none and modifies R s.t. R.p2 = none.

If R is an imcomplete registration (R.p2 == none && EP2 == none) the action button "Delete" is active.  
EPressing "Delete" deletes the registration R.   

If R is an imcomplete registration (R.p2 == none && EP2 != none) the action button "Add EPartner" is active.  
EPressing "Add EPartner" modifies registration R by setting R.p2=EP2.


The route should have 4 input components in all.   Two (NP1, NP2) in the NewRegistration section and two (EP1, EP2) in the ExistingRegistration section

## Data Table

After the ExistingRegistration line is a data table for all the partnerships in the current tournament.
Use the same conventions as used for the players data table in src/routes/players/+page.svelte

- Create a data table with data columns Player1.name, Player2.name for all partnerships in the current tournament.

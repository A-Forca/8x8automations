# Ticket Queue Logic

### All **“NEW”** tickets will be allocated according to the following logic

* FIFO (first-in-first-out) - the ticket that has the longest waiting time (oldest message date-time stamp) will be first allocated to an agent.
* Allocation to agents according to (a) their online availability and (b) their number of open tickets - a NEW ticket will only be allocated to an agent if they are online and if their number of open tickets is less than or equal to the number of tickets set per agent.

Admins are able to manually assign more than the Max ticket per agent, if they want to.  

### All **“OPEN”** (tickets that were re-opened by customers) will be allocated according to the following logic

* Reopened tickets will be pushed to the front of the waiting queue so that it will get assigned to the next available agent.
* To reiterate, reopened tickets are prioritised over new tickets.
* If an agent logs out for more than 15 minutes, his open tickets will go back to the queue.

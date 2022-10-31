# BitBurner
One Script to Rule them All (The Black Hat tutorial)

This code comes from the tutorial by The Black Hat on YouTube @ https://www.youtube.com/watch?v=nePsChf_Ifk

• Function Main() diverts all of the server's available threads to the most valuable command.

• Main calls upon three scripts to weaken, grow and hack: 'bin.wk.js, bin.gr.js, and bin.hk.js'.

• Function ServerList() returns an array of servers to hack dynamically.

• Function TreadCount() converts hostname & scriptRam into a number of threads that represents the server's total capacity.

----------------------------------------------------------------------

OPEN TROUBLESHOOTING QUESTION I HAVE: (10/30/2022)

Hi Black Hat, I just posted a detailed question about ns.exec not working for two of the implementations in Go.js, but the comment disappeared? 

In Go.js there are three uses of ns.exec

ns.exec("bin.wk.js", server, available_threads, target); // Weaken the target while security > minSecurity.
ns.exec("bin.gr.js", server, available_threads, target); // Grow the target while money < maxMoney.	
ns.exec("bin.hk.js", server, available_threads); // Hack the target

weaken and hack both produce this error: 'hostname' should be a string. Is undefined.

But grow runs and does not produce that error. I am using v2.1.0 (8f4636cb)

Are you aware of any updates to the game that might be causing this? I have my code at github. (https://github.com/afsanchez001/BitBurner)

Thank you for this great tutorial! I hope you can spot my problem.

----------------------------------------------------------------------

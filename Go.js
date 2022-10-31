/** @param {NS} ns */
export async function main(ns) {
	
	let servers = serverList(ns); // Start here.	
	let target = "foodnstuff"; // Our target.

	while(true) {
		for (let server of servers) {
			// Divert all of this server's available threads to the most valuable command. 
			// To do this we need to know how many threads are available on the server.
			if(ns.hasRootAccess(server)) {

				if(ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) { 
			
					let available_threads = threadCount(ns, server, 1.75);									
					if(available_threads >= 1)
					{
						ns.print("weakening: " + server);
						ns.exec("bin.wk.js", server, available_threads, target); // Weaken the target while security > minSecurity.
					}
				} else if(ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server)) {
					
					let available_threads = threadCount(ns, server, 1.75);							
					if(available_threads >= 1)
					{
						ns.print("growing: " + server);
						ns.exec("bin.gr.js", server, available_threads, target); // Grow the target while money < maxMoney.						
					}
				} else {
					
					let available_threads = threadCount(ns, server, 1.7, target);
					if(available_threads >= 1)
					{
						ns.print("hacking: " + server);
						ns.exec("bin.hk.js", server, available_threads); // Hack the target						
					}					
				}
			} else {
				try {
					// Open all possible ports on every server; then attempt to nuke.
					ns.print("Opening all possible ports before nuking. @" + server);

					ns.brutessh(server);
					ns.ftpcrack(server);
					ns.relaysmtp(server);
					ns.httpworm(server);
					ns.sqlinject(server);
				}
				catch {}
				try { 
					ns.print("Nuking, " + server);
					ns.nuke(server);
				}
				catch {}
			}
		}	
		await ns.sleep(10); // to avoid 'not using await' error.
	}
}

/* Return an array of servers to hack dynamically */
function serverList(ns, current="home", set = new Set())
{	
	let connections = ns.scan(current);
	let next = connections.filter(c => !set.has(c));

	next.forEach(n => 	{
		set.add(n);
		return serverList(ns, n, set);
	});

	return Array.from(set.keys());
}

// Convert hostname & scriptRam into a number of threads that represents the server's total capacity.
function threadCount(ns, hostname, scriptRam)
{
	let threads = 0;
	let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);

	threads = free_ram / scriptRam;
	return Math.floor(threads) // Flooring this returns an integer. Avoids returning half a thread, or 1.5 threads, etc. 
}

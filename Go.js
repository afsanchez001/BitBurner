/** @param {NS} ns */
export async function main(ns) {

	let servers = serverList(ns); // Start here.	
	let target = "foodnstuff"; // Our target.

	// Copy files between servers.
	for (let server of servers) {
		await ns.scp(["bin.wk.js", "bin.gr.js", "bin.hk.js"], server, "home");
	}

	// This block adapted from u/Naive-Store1451 on Reddit.
	// ns.print("*************************************************");
	// ns.print("*");
	// ns.print("*       Auto-create the Burster programs ");
	// ns.print("*       [BruteSSH, FTPCrack, relaySMTP, HTTPWorm, SQLInject] ");
	// ns.print("*       if they are unlocked."); // COPY to other servers?
	// ns.print("*");
	// ns.print("*************************************************");
	// let i = 0;
	// let allBursters = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
	// while (i < allBursters.length) {
	// 	let bursterExists = ns.fileExists(allBursters[i]);
	// 	if (bursterExists) {
	// 		i = i + 1;
	// 	} else {
	// 		ns.createProgram(allBursters[i]);
	// 		await ns.sleep(60000);
	// 	}
	// 	await ns.sleep(1000);
	// }

	while (true) {
		for (let server of servers) {

			ns.print("*************************************************");
			ns.print("*");
			ns.print("*       Starting Hacking Script");
			ns.print("*");
			ns.print("*************************************************");

			// Divert all of this server's available threads to the most valuable command. 
			// To do this we need to know how many threads are available on the server.
			if (ns.hasRootAccess(server) && ns.hasRootAccess(target)) {

				if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {

					let available_threads = threadCount(ns, server, 1.75);
					if (available_threads >= 1) {
						ns.print("weakening: " + server);
						ns.exec("bin.wk.js", server, available_threads, target); // Weaken the target while security > minSecurity.
					}
				} else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {

					let available_threads = threadCount(ns, server, 1.75);
					if (available_threads >= 1) {
						ns.print("growing: " + server);
						ns.exec("bin.gr.js", server, available_threads, target); // Grow the target while money < maxMoney.						
					}
				} else {

					let available_threads = threadCount(ns, server, 1.7, target);
					if (available_threads >= 1) {
						ns.print("hacking: " + server);
						ns.exec("bin.hk.js", server, available_threads); // Hack the target						
					}
				}
			} else {
				try {

					ns.print("*************************************************");
					ns.print("*");
					ns.print("*       Opening all possible ports on all servers ");
					ns.print("*       (SSH, FTP, SMTP, HTTP, SQL) ");
					ns.print("*       before using unlocked bursters.");
					ns.print("*");
					ns.print("*************************************************");

					if (ns.fileExists("BruteSSH.exe")) {
						await ns.brutessh(server);
					} else { ns.print("BruteSSH.exe unavailable for " + server); }

					if (ns.fileExists("FTPCrack.exe")) {
						await ns.ftpcrack(server);
					} else { ns.print("FTPCrack.exe unavailable for " + server); }

					if (ns.fileExists("relaySMTP.exe")) {
						await ns.relaysmtp(server);
					} else { ns.print("relaySMTP.exe unavailable for " + server); }

					if (ns.fileExists("HTTPWorm.exe")) {
						await ns.httpworm(server);
					} else { ns.print("HTTPWorm.exe unavailable for " + server); }

					if (ns.fileExists("SQLInject.exe")) {
						await ns.sqlinject(server);
					} else { ns.print("SQLInject.exe unavailable for " + server); }
				}
				catch {
					// ...
				}

				try {
					ns.print("*************************************************");
					ns.print("*       Nuking " + server + " on all open ports.");
					ns.print("*************************************************");
					await ns.nuke(server);
				}
				catch {
					// ...
				}

			}
			await ns.sleep(10000); // 10 seconds, to avoid 'not using await' error.
		}
	}
}

/* Return an array of servers to hack dynamically */
function serverList(ns, current = "home", set = new Set()) {
	let connections = ns.scan(current);
	let next = connections.filter(c => !set.has(c));

	next.forEach(n => {
		set.add(n);
		return serverList(ns, n, set);
	});

	return Array.from(set.keys());
}

// Convert hostname & scriptRam into a number of threads that represents the server's total capacity.
function threadCount(ns, hostname, scriptRam) {
	let threads = 0;
	let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);

	threads = free_ram / scriptRam;
	return Math.floor(threads) // Flooring this returns an integer. Avoids returning half a thread, or 1.5 threads, etc. 
}

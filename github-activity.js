#!/usr/bin/env node
async function main() {
    if (process.argv.length > 3) {
        console.log("Usage: github-activity <username>");
        process.exit(1);
    }

    let username = process.argv[2];
    let url = `https://api.github.com/users/${username}/events`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'github-activiy-cli'
            }
        });

        if (response.status === 404) {
            console.log("User not found");
            process.exit(1);
        };

        if (!response.ok) {
            throw new Error(`Github API error: ${response.status}`);
        }

        const events = await response.json();

        console.log('Output:');
        for (let event of events) {
            if (event.type === 'PullRequestEvent') {
                console.log(`- ${event.payload.action} a pull request in ${event.repo.name}`);
            }
            else if (event.type === 'IssuesEvent'){
                console.log(`- ${event.payload.action} an issue request ${event.repo.name}`);
            }
            else if (event.type === 'PushEvent'){
                let commit = event.payload.push_id;
                console.log(`- pushed ${commit} to ${event.repo.name}`);
            }
            else if(event.type === 'WatchEvent'){
                console.log(`- Starred ${event.repo.name}`);
            }
        };

    }
    catch (e){
        console.error('Error', e.message);
        process.exit(1);
    }

}

main();
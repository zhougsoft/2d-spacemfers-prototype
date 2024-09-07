generateCodeBlock() {
    local filePath=$1
    local fileType="sql"
    if [[ $filePath == *.xml ]]; then
        fileType="xml"
    elif [[ $filePath == *.csv ]]; then
        fileType="csv"
    elif [[ $filePath == *.json ]]; then
        fileType="json"
    elif [[ $filePath == *.md ]]; then
        fileType="markdown"
    fi
    echo "### FILE: $filePath\n\`\`\`$fileType\n$(cat $filePath)\n\`\`\`"
}


# db setup & teardown
db_up=$(generateCodeBlock "src/sql/db-up.sql")
db_down=$(generateCodeBlock "src/sql/db-down.sql")

# player admin
create_player=$(generateCodeBlock "src/sql/players/create-player.sql")
delete_player=$(generateCodeBlock "src/sql/players/delete-player.sql")

# player state
get_active_ship=$(generateCodeBlock "src/sql/player-state/get-active-ship.sql")
set_active_ship=$(generateCodeBlock "src/sql/player-state/set-active-ship.sql")
get_location=$(generateCodeBlock "src/sql/player-state/get-location.sql")
set_location=$(generateCodeBlock "src/sql/player-state/set-location.sql")

echo -e "You are a world-class Postgres engineer, SQL wizard and senior relational database systems expert. \
Your task is to be my consultant for my game spacemfers. spacemfers is a web-based, open-universe, idle-clicker, lofi space sandbox MMO inspired by EVE Online.\n\n\
I am creating this project from the ground up at the database level. I want it to be as optimized and normalized as possible, and stay true to the best conventions and practices. \
The project uses PostgreSQL. Here are the relevant project files.\n\n\
## Table setup & teardown:\n\n${db_up}\n\n${db_down}\n\n\
## Player admin:\n\n${create_player}\n\n${delete_player}\n\n\
## Player state:\n\n${get_active_ship}\n\n${set_active_ship}\n\n${get_location}\n\n${set_location}\n\n\
## Instruction:\nThoroughly study the files until you completely grasp the premise and functionality. \
Only when you have achieved full understanding, reply with 'I understand' only and wait for further instruction."

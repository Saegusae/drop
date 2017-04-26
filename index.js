module.exports = function Drop(dispatch) {

    let cid,
        model,
        name,
        location,
        zone,
        currHp,
        maxHp;

    let castPassive = false;
    let fallDistance = 0;

    dispatch.hook('S_LOGIN', 2, (event) => {
        ({
            cid,
            model,
            name
        } = event);

        castPassive = ((model - 100) / 200 % 50) === 3;
    });

    dispatch.hook('S_LOAD_TOPO', 1, (event) => {
        zone = event.zone;
    });

    dispatch.hook('S_CREATURE_CHANGE_HP', 2, (event) => {

        currHp = event.curHp;
        maxHp = event.maxHp;

    });

    dispatch.hook('S_SPAWN_ME', 1, (event) => {});

    dispatch.hook('C_PLAYER_LOCATION', 1, (event) => {
        location = event;
    });

    dispatch.hook('C_CHAT', 1, (event) => {
        if (event.message.includes('!drop')) {

            let amount = parseInt(event.message.replace(/<\/?[^<>]*>/gi, '').split(' ')[1]) || null;

            if (amount && currHp && maxHp) {
                let amountToDrop = (currHp - (maxHp / amount)) / maxHp;

                if (amount < 100 && amount > 0) {

                    if (castPassive)
                        fallDistance = 400 + ((amountToDrop * 2) * 10);
                    else {
                        fallDistance = 400 + (amountToDrop * 10);
                    }

                    location.z1 += fallDistance;

                    dispatch.toServer('C_PLAYER_LOCATION', 1, location);

                    dispatch.toClient('S_SPAWN_ME', 1, {
                        target: cid,
                        x: location.x1,
                        y: location.y1,
                        z: location.z1,
                        alive: 1,
                        unk: 0
                    });
                }
            }

            return false;
        }
    });
};

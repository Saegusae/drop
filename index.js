module.exports = function Drop(dispatch) {

    let cid,
        model,
        name,
        location,
        zone;

    let fallDistance = 0;

    dispatch.hook('S_LOGIN', 2, (event) => {
        ({
            cid,
            model,
            name
        } = event);
    });

    dispatch.hook('S_LOAD_TOPO', 1, (event) => {
        zone = event.zone;
    });

    dispatch.hook('S_SPAWN_ME', 1, (event) => {});

    dispatch.hook('C_PLAYER_LOCATION', 1, (event) => {
        location = event;
    });

    dispatch.hook('C_CHAT', 1, (event) => {
        if (event.message.includes('!drop')) {

            let amount = event.message.replace(/<\/?[^<>]*>/gi, '').split(' ')[1] || null;

            if (amount) {
                switch (parseInt(formatted)) {
                    case 50:
                    case 40:
                    case 30:
                    case 20:
                    case 10:
                        fallDistance = 1400 - (parseInt(formatted) / 10) * 100;
                    default:
                        return false;
                }

                location.z1 += fallDistance;

                dispatch.toServer('C_PLAYER_LOCATION', 1, location);

                dispatch.toClient(S_SPAWN_ME, 1, {
                    target: cid,
                    x: location.x1,
                    y: location.y1,
                    z: location.z1,
                    alive: 1,
                    unk: 0
                });
            }

            return false;
        }
    });
};

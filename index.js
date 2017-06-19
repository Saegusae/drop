const Command = require('command')

module.exports = function Drop(dispatch) {
	const command = Command(dispatch)

	let cid,
		model,
		location,
		curHp,
		maxHp,
		castPassive = false,
		fallDistance = 0

	dispatch.hook('S_LOGIN', 2, event => {
		({cid, model} = event)

		castPassive = ((model - 100) / 200 % 50) === 3
	})

	dispatch.hook('S_PLAYER_STAT_UPDATE', 4, event => {
		curHp = event.curHp
		maxHp = event.maxHp
	})

	dispatch.hook('S_CREATURE_CHANGE_HP', 2, event => {
		if(event.target.equals(cid)) {
			curHp = event.curHp
			maxHp = event.maxHp
		}
	})

	dispatch.hook('C_PLAYER_LOCATION', 1, event => { location = event })

	command.add('drop', amount => {
		amount = Number(amount)

		if(amount && curHp && maxHp) {
			let amountToDrop = (curHp * 100 / maxHp) - amount

			if(amount < 100 && amount > 0 && amountToDrop > 0) {
				if(!castPassive) fallDistance = 400 + (amountToDrop * 10)
				else fallDistance = 400 + (amountToDrop * 20)

				location.z1 += fallDistance

				dispatch.toClient('S_INSTANT_MOVE', 1, {
					id: cid,
					x: location.x1,
					y: location.y1,
					z: location.z1,
					w: location.w
				})
			}
		}
	})
}
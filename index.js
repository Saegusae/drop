const Command = require('command')

module.exports = function Drop(dispatch) {
	const command = Command(dispatch)

	let gameId = -1,
		isCastanic = false,
		location = null,
		locRealTime = 0,
		curHp = 0,
		maxHp = 0

	dispatch.hook('S_LOGIN', 9, event => {
		({gameId} = event)
		isCastanic = Math.floor((event.templateId - 10101) / 200) === 3
	})

	dispatch.hook('S_PLAYER_STAT_UPDATE', 8, event => {
		curHp = event.hp
		maxHp = event.maxHp
	})

	dispatch.hook('S_CREATURE_CHANGE_HP', 6, event => {
		if(event.target.equals(gameId)) {
			curHp = event.curHp
			maxHp = event.maxHp
		}
	})

	dispatch.hook('C_PLAYER_LOCATION', 2, event => {
		location = event
		locRealTime = Date.now()
	})

	command.add('drop', percent => {
		percent = Number(percent)

		if(!(percent > 0 && percent <= 100) || !curHp) return

		let percentToDrop = (curHp * 100 / maxHp) - percent

		if(percentToDrop <= 0) return

		dispatch.toServer('C_PLAYER_LOCATION', 2, Object.assign({}, location, {
			z: location.z + 400 + percentToDrop * (isCastanic ? 20 : 10),
			type: 2,
			time: location.time - locRealTime + Date.now() - 50
		}))
		dispatch.toServer('C_PLAYER_LOCATION', 2, Object.assign(location, {
			type: 7,
			time: location.time - locRealTime + Date.now() + 50
		}))
	})
}
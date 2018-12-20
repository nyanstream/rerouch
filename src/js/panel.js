'use strict'

var initAdminPanel = (data = {}) => {
	$make.qs('form', ['a'])
		.forEach(form => { form.reset() })

	try {
		moment.tz.setDefault(data.timezone)
	} catch (e) { }

	try {
		let needToChangeTime = (data.sched.count > 0)

		let newTime = data.sched.latest.end

		if (needToChangeTime) {
			$make.qs('.add-air input[type*=datetime]')
				.setAttribute(
					'value',
					moment.unix(newTime).format('YYYY-MM-DDTHH:mm')
				)
		}
	} catch (e) { }

	try {
		let infoEl = $make.qs('.rm-air .info')

		let emptySched = {
			anime: (infoEl && data.sched.count == 0)
		}

		infoEl.innerHTML = (data.sched.count > 0 && infoEl)
			? `Название: <q>${data.sched.latest.title}</q>. Начало ${moment.unix(data.sched.latest.start).format('LLL')}; Конец: ${moment.unix(data.sched.latest.end).format('LLL')}`
			: 'Расписание пустое'

		let schedsNames = Object.keys(emptySched)

		let emptyScheds = schedsNames.filter(key => emptySched[key] == true)

		if (schedsNames.length == emptyScheds.length) {
			Array.from($make.qs('.rm-air input', ['a'])).forEach(input => {
				input.setAttribute('disabled', '')
			})
		}
	} catch (e) { }

	try {
		let exprsSched = {
			anime: data.sched.countExpr
		}

		if (!$make.qs('.expired-clear')) { throw 42 }

		$make.qs('.expired-clear .count').innerHTML = `Всего просроченных эфиров: ${exprsSched['anime']}.`

		if (exprsSched['anime'] == 0) {
			Array.from($make.qs('.expired-clear input', ['a'])).forEach(input => {
				input.setAttribute('disabled', '')
			})
		}
	} catch (e) { }

	try {
		let vkLink = $make.qs('.vk-link p')
		if (!vkLink) { throw 42 }

		vkLink.appendChild(
			$create.link(
				`${data.vk.URL}?client_id=${data.vk.appID}&display=page&redirect_uri=https://${data.server}/${data.vk.api}&scope=video,offline&response_type=code&state=vk-get-code`,
				'Просто нажми сюда',
				'',
				['e']
			)
		)
	} catch (e) { }

	try {
		if (!$make.qs('.noti')) { throw 42 }

		let notiInputTest = $make.qs('.noti input#noti_text')

		let notiInputColor = $make.qs('.noti input#noti_color')

		let notiSubmitBtn = $make.qs('.noti input[type="submit"]')

		let notiSubmitBtnText =  'Создать'

		let notiTextElem = $make.qs('.noti .noti-text')

		let notiTextElemContent = $make.qsf('samp', notiTextElem)

		if (data.noti.enabled == true) {
			notiTextElemContent.textContent = data.noti.text

			if (data.noti.color) {
				notiTextElem.style.backgroundColor = data.noti.color
			}

			notiSubmitBtn.value = 'Заменить'
			notiSubmitBtnText = 'Заменить'
		} else {
			notiTextElemContent.textContent = 'Оповещения нет'
		}

		$make.qs('.noti input#noti_rm').addEventListener('change', e => {
			let _this = e.target

			if (_this.checked) {
				notiInputTest.setAttribute('disabled', '')
				notiInputColor.setAttribute('disabled', '')
				notiInputTest.value = ''
				notiSubmitBtn.value = 'Удалить'
			} else if (
				!_this.checked &&
				notiInputTest.hasAttribute('disabled') &&
				notiInputColor.hasAttribute('disabled')
			) {
				notiInputTest.removeAttribute('disabled')
				notiInputColor.removeAttribute('disabled', '')
				notiSubmitBtn.value = notiSubmitBtnText
			}
		})
	} catch (e) { }

	try {
		let
			tsSched =      Number(data.ts.sched),
			tsNoti =       Number(data.ts.noti),
			currentTime =  Number(data.ts.current)

		let
			tsSchedElem =    $make.qs('footer span[data-ts="sched"]'),
			tsNotiElem =     $make.qs('footer span[data-ts="noti"]'),
			tsCurrentElem =  $make.qs('footer span[data-ts="current"]')

		if (tsSchedElem) { tsSchedElem.textContent = moment.unix(tsSched).from() }
		if (tsNotiElem) { tsNotiElem.textContent = moment.unix(tsNoti).from() }

		if (tsCurrentElem) {
			setInterval(() => {
				tsCurrentElem.textContent = moment.unix(currentTime).format('LL LTS')
				++currentTime
			}, 1000)
		}
	} catch (e) {}
}

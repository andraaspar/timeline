import { withInterface } from 'illa/Type';
import { DateTime, Settings } from 'luxon';
import { eventInputFromString } from './EventInput_Methods';

Settings.throwOnInvalid = true

describe('eventInputFromString', () => {
	it('supports exact time', () => {
		expect(eventInputFromString('Europe/Budapest', '[2018-04-23 15:31] The summary')).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-04-23T15:31:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2018-04-23T15:31:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})

	it('supports exact time range', () => {
		expect(eventInputFromString('Europe/Budapest', '[2018-04-23 15:31][2019-05-24 22:39] The summary')).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-04-23T15:31:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2019-05-24T22:39:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})

	it('supports exact date', () => {
		expect(eventInputFromString('Europe/Budapest', '[2018-04-23] The summary')).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				date: '2018-04-23',
			},
			end: {
				date: '2018-04-24',
			},
		}))
	})

	it('supports exact date range', () => {
		expect(eventInputFromString('Europe/Budapest', '[2018-04-23][2018-05-31] The summary')).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				date: '2018-04-23',
			},
			end: {
				date: '2018-06-01',
			},
		}))
	})

	it('supports exact time with offset', () => {
		expect(eventInputFromString('Europe/Budapest', '[2018-04-23 15:31+pt15m] The summary')).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-04-23T15:46:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2018-04-23T15:46:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})

	it('supports exact time with duration offset', () => {
		expect(eventInputFromString('Europe/Budapest', '[2018-04-23 15:31][+pt15m] The summary')).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-04-23T15:31:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2018-04-23T15:46:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})

	it('supports relative time', () => {
		expect(eventInputFromString('Europe/Budapest', '[+pt15m] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-04-23T15:46:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2018-04-23T15:46:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})

	it('supports date without year', () => {
		expect(eventInputFromString('Europe/Budapest', '[10-02] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				date: '2018-10-02',
			},
			end: {
				date: '2018-10-03',
			},
		}))
	})

	it('supports date time without year', () => {
		expect(eventInputFromString('Europe/Budapest', '[10-02 15:31] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-10-02T15:31:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2018-10-02T15:31:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})
	
	it('fills in year of date with next year when otherwise in past', () => {
		expect(eventInputFromString('Europe/Budapest', '[02-12] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				date: '2019-02-12',
			},
			end: {
				date: '2019-02-13',
			},
		}))
	})

	it('supports date without year and month', () => {
		expect(eventInputFromString('Europe/Budapest', '[25] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				date: '2018-04-25',
			},
			end: {
				date: '2018-04-26',
			},
		}))
	})
	
	it('fills in month of date with next month when otherwise in past', () => {
		expect(eventInputFromString('Europe/Budapest', '[12] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				date: '2018-05-12',
			},
			end: {
				date: '2018-05-13',
			},
		}))
	})

	it('supports time without date', () => {
		expect(eventInputFromString('Europe/Budapest', '[19:47] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-04-23T19:47:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2018-04-23T19:47:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})
	
	it('fills in date of time with next day when otherwise in past', () => {
		expect(eventInputFromString('Europe/Budapest', '[13:21] The summary', { now: DateTime.fromSQL('2018-04-23 15:31', { zone: 'Europe/Budapest' }) })).toEqual(withInterface<gapi.client.calendar.EventInput>({
			summary: 'The summary',
			start: {
				dateTime: '2018-04-24T13:21:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
			end: {
				dateTime: '2018-04-24T13:21:00.000+02:00',
				timeZone: 'Europe/Budapest',
			},
		}))
	})
})
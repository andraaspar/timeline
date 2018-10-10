
export enum ActionType {
	SetEvents = 'SetEvents',
	InitGapi = 'InitGapi',
	LoadEventsFromAllCalendars = 'LoadEventsFromAllCalendars',
	SetSignedIn = 'SetSignedIn',
	SignIn = 'SignIn',
	SignOut = 'SignOut',
	SetGapiReady = 'SetGapiReady',
	SetCalendars = 'SetCalendars',
	LoadCalendars = 'LoadCalendars',
	SetNow = 'SetNow',
	SetLocale = 'SetLocale',
	SetVisibility = 'SetVisibility',
	AddErrors = 'AddErrors',
	ClearErrors = 'ClearErrors',
	UpdateStateLoad = 'UpdateStateLoad',
	RequestEventInsert = 'RequestEventInsert',
}
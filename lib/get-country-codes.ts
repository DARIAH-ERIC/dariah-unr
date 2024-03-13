const countries = new Map([
	["Austria", "at"],
	["Belgium", "be"],
	["Bosnia and Herzegovina", "ba"],
	["Bulgaria", "bg"],
	["Croatia", "hr"],
	["Cyprus", "cy"],
	["Czech Republic", "cz"],
	["Denmark", "dk"],
	["France", "fr"],
	["Germany", "de"],
	["Greece", "gr"],
	["Ireland", "ie"],
	["Italy", "it"],
	["Luxembourg", "lu"],
	["Malta", "mt"],
	["Netherlands", "nl"],
	["Poland", "pl"],
	["Portugal", "pt"],
	["Serbia", "rs"],
	["Slovenia", "si"],
	["Spain", "es"],
	["Switzerland", "ch"],
	["Finland", "fi"],
	["Hungary", "hu"],
	["Norway", "no"],
	["Romania", "ro"],
	["Sweden", "se"],
	["Slovakia", "sk"],
	["United Kingdom", "gb"],
	["Egypt", "eg"],
	["Iceland", "is"],
	["United States", "us"],
	["Latvia", "lv"],
]);

export function getCountryCodes(): Map<string, string> {
	return countries;
}
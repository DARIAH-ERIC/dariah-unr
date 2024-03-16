import { assert, log } from "@acdh-oeaw/lib";
import {
	type EventSizeType,
	type OutreachType,
	PrismaClient,
	type ServiceSizeType,
} from "@prisma/client";

const db = new PrismaClient();

async function createAnnualValues() {
	for (const [acronym, annualValue] of Object.entries(roles)) {
		const role = await db.role.findFirst({
			where: {
				bodies: {
					some: {
						acronym,
					},
				},
			},
		});
		assert(role);
		await db.role.update({
			where: {
				id: role.id,
			},
			data: {
				annualValue,
			},
		});
	}

	for (const [_type, annualValue] of Object.entries(events)) {
		const type = _type as EventSizeType;
		const eventSize = await db.eventSize.findFirst({
			where: {
				type,
			},
		});
		assert(eventSize);
		await db.eventSize.update({
			where: {
				id: eventSize.id,
			},
			data: {
				annualValue,
			},
		});
	}

	for (const [_type, annualValue] of Object.entries(services)) {
		const type = _type as ServiceSizeType;
		const serviceSize = await db.serviceSize.findFirst({
			where: {
				type,
			},
		});
		assert(serviceSize);
		await db.serviceSize.update({
			where: {
				id: serviceSize.id,
			},
			data: {
				annualValue,
			},
		});
	}

	for (const [_type, annualValue] of Object.entries(outreach)) {
		const type = _type as OutreachType;
		const outreachTypeValue = await db.outreachTypeValue.findFirst({
			where: {
				type,
			},
		});
		assert(outreachTypeValue);
		await db.outreachTypeValue.update({
			where: {
				id: outreachTypeValue.id,
			},
			data: {
				annualValue,
			},
		});
	}
}

createAnnualValues()
	.then(() => {
		log.success("Successfully updated annual values in the database.");
	})
	.catch((error) => {
		log.error("Failed to update annual values in the database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});

// ------------------------------------------------------------------------------------------------

const personMonth = 5_000;

const roles = {
	/** National coordinator. */
	nc: 2 * personMonth,
	/** JRC member. */
	jrc: 1.5 * personMonth,
	/** Working group chair. */
	wg: personMonth,
};

const events: Record<EventSizeType, number> = {
	/** Meetings with more than 50 people. */
	large: 10_000,
	/** Meetings with 20-50 people. */
	medium: 5_000,
	/** Meetings with less than 20 people. */
	small: 1_000,
	/** DARIAH annual event. */
	dariah_commissioned: 50_000,
};

const services: Record<ServiceSizeType, number> = {
	/** 1 person month + 25% overheads. */
	small: 6_250,
	/** 3 person months + 25% overheads. */
	medium: 18_750,
	/** 6 person months + 25% overheads. */
	large: 37_500,
	/** 12 person months + 25% overheads. */
	core: 75_000,
};

const outreach: Record<OutreachType, number> = {
	national_website: 5_000,
	social_media: 2_000,
};

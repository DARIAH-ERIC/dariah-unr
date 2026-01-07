import { defineRelations } from "drizzle-orm";
import * as schema from "@/db/schema";

export const relations = defineRelations(schema, (r) => {
	return {
		bodies: {
			roles: r.many.roles({
				from: r.bodies.id.through(r.bodyToRole.a),
				to: r.roles.id.through(r.bodyToRole.b),
			}),
		},
		roles: {
			bodies: r.many.bodies(),
			contributions: r.many.contributions(),
		},
		countries: {
			institutions: r.many.institutions({
				from: r.countries.id.through(r.countryToInstitution.a),
				to: r.institutions.id.through(r.countryToInstitution.b),
			}),
			services: r.many.services({
				from: r.countries.id.through(r.countryToService.a),
				to: r.services.id.through(r.countryToService.b),
			}),
			softwares: r.many.software({
				from: r.countries.id.through(r.countryToSoftware.a),
				to: r.software.id.through(r.countryToSoftware.b),
			}),
			contributions: r.many.contributions(),
			outreachs: r.many.outreach(),
			reports: r.many.reports(),
			persons: r.many.persons({
				from: r.countries.id.through(r.users.countryId),
				to: r.persons.id.through(r.users.personId),
			}),
		},
		institutions: {
			countries: r.many.countries(),
			persons: r.many.persons({
				from: r.institutions.id.through(r.institutionToPerson.a),
				to: r.persons.id.through(r.institutionToPerson.b),
			}),
			services: r.many.services({
				from: r.institutions.id.through(r.institutionService.institutionId),
				to: r.services.id.through(r.institutionService.serviceId),
			}),
		},
		services: {
			countries: r.many.countries(),
			institutions: r.many.institutions(),
			reports: r.many.reports(),
			serviceSize: r.one.serviceSizes({
				from: r.services.sizeId,
				to: r.serviceSizes.id,
			}),
		},
		software: {
			countries: r.many.countries(),
		},
		persons: {
			institutions: r.many.institutions(),
			contributions: r.many.contributions(),
			countries: r.many.countries(),
		},
		contributions: {
			country: r.one.countries({
				from: r.contributions.countryId,
				to: r.countries.id,
			}),
			person: r.one.persons({
				from: r.contributions.personId,
				to: r.persons.id,
			}),
			role: r.one.roles({
				from: r.contributions.roleId,
				to: r.roles.id,
			}),
			workingGroup: r.one.workingGroups({
				from: r.contributions.workingGroupId,
				to: r.workingGroups.id,
			}),
		},
		workingGroups: {
			contributions: r.many.contributions(),
			workingGroupOutreachs: r.many.workingGroupOutreach(),
			workingGroupReports: r.many.workingGroupReports(),
		},
		eventReports: {
			report: r.one.reports({
				from: r.eventReports.reportId,
				to: r.reports.id,
			}),
		},
		reports: {
			eventReports: r.many.eventReports(),
			outreachs: r.many.outreach(),
			projects: r.many.projects(),
			country: r.one.countries({
				from: r.reports.countryId,
				to: r.countries.id,
			}),
			researchPolicyDevelopments: r.many.researchPolicyDevelopments(),
			services: r.many.services({
				from: r.reports.id.through(r.serviceReports.reportId),
				to: r.services.id.through(r.serviceReports.serviceId),
			}),
		},
		outreach: {
			country: r.one.countries({
				from: r.outreach.countryId,
				to: r.countries.id,
			}),
			reports: r.many.reports({
				from: r.outreach.id.through(r.outreachReports.outreachId),
				to: r.reports.id.through(r.outreachReports.reportId),
			}),
		},
		outreachKpis: {
			outreachReport: r.one.outreachReports({
				from: r.outreachKpis.outreachReportId,
				to: r.outreachReports.id,
			}),
		},
		outreachReports: {
			outreachKpis: r.many.outreachKpis(),
		},
		projects: {
			report: r.one.reports({
				from: r.projects.reportId,
				to: r.reports.id,
			}),
		},
		researchPolicyDevelopments: {
			report: r.one.reports({
				from: r.researchPolicyDevelopments.reportId,
				to: r.reports.id,
			}),
		},
		serviceKpis: {
			serviceReport: r.one.serviceReports({
				from: r.serviceKpis.serviceReportId,
				to: r.serviceReports.id,
			}),
		},
		serviceReports: {
			serviceKpis: r.many.serviceKpis(),
		},
		serviceSizes: {
			services: r.many.services(),
		},
		sessions: {
			user: r.one.users({
				from: r.sessions.userId,
				to: r.users.id,
			}),
		},
		users: {
			sessions: r.many.sessions(),
			country: r.one.countries({
				from: r.users.countryId,
				to: r.countries.id,
			}),
			person: r.one.persons({
				from: r.users.personId,
				to: r.persons.id,
			}),
		},
		workingGroupEvents: {
			workingGroupReport: r.one.workingGroupReports({
				from: r.workingGroupEvents.reportId,
				to: r.workingGroupReports.id,
			}),
		},
		workingGroupReports: {
			workingGroupEvents: r.many.workingGroupEvents(),
			workingGroup: r.one.workingGroups({
				from: r.workingGroupReports.workingGroupId,
				to: r.workingGroups.id,
			}),
		},
		workingGroupOutreach: {
			workingGroup: r.one.workingGroups({
				from: r.workingGroupOutreach.workingGroupId,
				to: r.workingGroups.id,
			}),
		},
	};
});

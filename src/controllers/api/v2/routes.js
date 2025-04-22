/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    5/17/22 2:15 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

module.exports = function (middleware, router, controllers) {
  // Shorten Vars
  const apiv2Auth = middleware.apiv2
  const isAdmin = middleware.isAdmin
  const isAgent = middleware.isAgent
  const isAgentOrAdmin = middleware.isAgentOrAdmin
  const csrfCheck = middleware.csrfCheck
  const canUser = middleware.canUser

  // Common
  router.get('/api/v2/login', apiv2Auth, controllers.api.v2.accounts.sessionUser)
  router.post('/api/v2/login', controllers.api.v2.common.login)
  router.post('/api/v2/token', controllers.api.v2.common.token)
  router.get('/api/v2/viewdata', middleware.loadCommonData, controllers.api.v2.common.viewData)

  // Accounts
  router.get('/api/v2/accounts', apiv2Auth, canUser('accounts:view'), controllers.api.v2.accounts.get)
  router.post('/api/v2/accounts', apiv2Auth, canUser('accounts:create'), controllers.api.v2.accounts.create)
  router.put('/api/v2/accounts/profile', apiv2Auth, csrfCheck, controllers.api.v2.accounts.saveProfile)
  router.post('/api/v2/accounts/profile/mfa', apiv2Auth, csrfCheck, controllers.api.v2.accounts.generateMFA)
  router.post('/api/v2/accounts/profile/mfa/verify', apiv2Auth, csrfCheck, controllers.api.v2.accounts.verifyMFA)
  router.post('/api/v2/accounts/profile/mfa/disable', apiv2Auth, csrfCheck, controllers.api.v2.accounts.disableMFA)
  router.post('/api/v2/accounts/profile/update-password', apiv2Auth, csrfCheck, controllers.api.v2.accounts.updatePassword)
  router.put('/api/v2/accounts/:username', apiv2Auth, canUser('accounts:update'), controllers.api.v2.accounts.update)

  // Ticket Info
  router.get('/api/v2/tickets/info/types', apiv2Auth, controllers.api.v2.tickets.info.types)

  // Tickets
  router.get('/api/v2/tickets', apiv2Auth, canUser('tickets:view'), controllers.api.v2.tickets.get)
  router.post('/api/v2/tickets', apiv2Auth, canUser('tickets:create'), controllers.api.v2.tickets.create)
  router.post('/api/v2/tickets/transfer/:uid', apiv2Auth, isAdmin, controllers.api.v2.tickets.transferToThirdParty)
  router.get('/api/v2/tickets/:uid', apiv2Auth, canUser('tickets:view'), controllers.api.v2.tickets.single)
  router.put('/api/v2/tickets/batch', apiv2Auth, canUser('tickets:update'), controllers.api.v2.tickets.batchUpdate)
  router.put('/api/v2/tickets/:uid', apiv2Auth, canUser('tickets:update'), controllers.api.v2.tickets.update)
  router.delete('/api/v2/tickets/:uid', apiv2Auth, canUser('tickets:delete'), controllers.api.v2.tickets.delete)
  router.delete('/api/v2/tickets/deleted/:id', apiv2Auth, isAdmin, controllers.api.v2.tickets.permDelete)

  // Groups
  router.get('/api/v2/groups', apiv2Auth, controllers.api.v2.groups.get)
  router.post('/api/v2/groups', apiv2Auth, canUser('groups:create'), controllers.api.v2.groups.create)
  router.put('/api/v2/groups/:id', apiv2Auth, canUser('groups:update'), controllers.api.v2.groups.update)
  router.delete('/api/v2/groups/:id', apiv2Auth, canUser('groups:delete'), controllers.api.v2.groups.delete)

  // Teams
  router.get('/api/v2/teams', apiv2Auth, canUser('teams:view'), controllers.api.v2.teams.get)
  router.post('/api/v2/teams', apiv2Auth, canUser('teams:create'), controllers.api.v2.teams.create)
  router.put('/api/v2/teams/:id', apiv2Auth, canUser('teams:update'), controllers.api.v2.teams.update)
  router.delete('/api/v2/teams/:id', apiv2Auth, canUser('teams:delete'), controllers.api.v2.teams.delete)

  // Departments
  router.get('/api/v2/departments', apiv2Auth, canUser('departments:view'), controllers.api.v2.departments.get)
  router.post('/api/v2/departments', apiv2Auth, canUser('departments:create'), controllers.api.v2.departments.create)
  router.put('/api/v2/departments/:id', apiv2Auth, canUser('departments:update'), controllers.api.v2.departments.update)
  router.delete('/api/v2/departments/:id', apiv2Auth, canUser('departments:delete'), controllers.api.v2.departments.delete)

  // Notices
  router.get('/api/v2/notices', apiv2Auth, controllers.api.v2.notices.get)
  router.post('/api/v2/notices', apiv2Auth, canUser('notices:create'), controllers.api.v2.notices.create)
  // router.get('/api/v2/notices/active', apiv2Auth, controllers.api.v2.notices.getActive)
  router.put('/api/v2/notices/:id', apiv2Auth, canUser('notices:update'), controllers.api.v2.notices.update)
  router.put('/api/v2/notices/:id/activate', apiv2Auth, canUser('notices:activate'), controllers.api.v2.notices.activate)
  router.get('/api/v2/notices/clear', apiv2Auth, canUser('notices:deactivate'), controllers.api.v2.notices.clear)
  router.delete('/api/v2/notices/:id', apiv2Auth, canUser('notices:delete'), controllers.api.v2.notices.delete)

  router.get('/api/v2/messages/conversations', apiv2Auth, controllers.api.v2.messages.getConversations)
  router.get('/api/v2/messages/conversations/:id', apiv2Auth, controllers.api.v2.messages.single)
  router.delete('/api/v2/messages/conversations/:id', apiv2Auth, controllers.api.v2.messages.deleteConversation)

  // ElasticSearch
  router.get('/api/v2/es/search', middleware.api, controllers.api.v2.elasticsearch.search)
  router.get('/api/v2/es/rebuild', apiv2Auth, isAdmin, controllers.api.v2.elasticsearch.rebuild)
  router.get('/api/v2/es/status', apiv2Auth, isAdmin, controllers.api.v2.elasticsearch.status)
}

import LDAP from './ldap';

Meteor.methods({
  async ldap_test_connection() {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'ldap_test_connection' });
    }

    //TODO: This needs to be fixed - security issue -> alanning:meteor-roles
    //if (!RocketChat.authz.hasRole(user._id, 'admin')) {
    //	throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'ldap_test_connection' });
    //}

    if (LDAP.settings_get(LDAP_ENABLE) !== true) {
      throw new Meteor.Error('LDAP_disabled');
    }

    let ldap;
    try {
      ldap = new LDAP();
      ldap.connectSync();
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error.message);
    }

    try {
      ldap.bindIfNecessary();
    } catch (error) {
      throw new Meteor.Error(error.name || error.message);
    }

    return {
      message: 'Connection_success',
      params: [],
    };
  },
});

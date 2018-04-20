import { hash, resolve } from 'rsvp';
import Route from '@ember/routing/route';
import getCompactVersion from 'ember-api-docs/utils/get-compact-version';
import { pluralize } from 'ember-inflector';

export default Route.extend({

  model(params) {
    return this.store.findRecord('project', 'ember', { includes: 'project-version' })
      .then((project) => {
        // Currently redirecting to last 2.15 version until we can map old
        // Ember.* apis with rfc 176 items
        let lastVersion = '2.15.3';
        return this.store.findRecord('project-version', `ember-${lastVersion}`, { includes: 'project' });
      })
      .then((projectVersion) => {
        let project = projectVersion.get('project');
        let lastVersion = projectVersion.get('version');
        //peel off the .html
        let className = params['class'].substr(0, params['class'].lastIndexOf('.'));
        let id = `ember-${lastVersion}-${className}`;

        return hash({
          project: resolve(project),
          version: resolve(lastVersion),
          classData: this.store.find('class', id)
            .then((classData) => {
              return {
                type: 'class',
                data: classData
              };
            })
            .catch(() => {
              return this.store.find('namespace', id).then((classData) => {
                return {
                  type: 'namespace',
                  data: classData
                };
              });
            })
        });

      }).catch(e => resolve({ isError: true}));
  },

  redirect(model) {
    if (model.isError) {
      return this.transitionTo('404');
    }
    let compactVersion = getCompactVersion(model.version);
    return this.transitionTo(`project-version.${pluralize(model.classData.type)}.${model.classData.type}`,
      model.project.id,
      compactVersion,
      model.classData.data.get('name'));
  },

  serialize(model) {
    return {
      namespace: model.classData.get('name')
    }
  }

});

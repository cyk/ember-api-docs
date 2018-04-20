import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click } from 'ember-native-dom-helpers';

module('Acceptance | sidebar navigation', function(hooks) {
  setupApplicationTest(hooks);

  test('can navigate to namespace from sidebar', async function(assert) {
    await visit('/ember/1.0');
    await click(`${'[data-test-namespace="Ember.String"]'} a`);

    assert.equal(currentURL(), '/ember/1.0/namespaces/Ember.String', 'navigated to namespace');
  });

  test('can navigate to module from sidebar', async function(assert) {
    await visit('/ember/1.0');
    await click(`${'[data-test-module="ember-application"]'} a`);

    assert.equal(currentURL(), '/ember/1.0/modules/ember-application', 'navigated to module');
  });

  test('can navigate to class from sidebar', async function(assert) {
    await visit('/ember/1.0');
    await click(`${'[data-test-class="Ember.Component"]'} a`);

    assert.equal(currentURL(), '/ember/1.0/classes/Ember.Component', 'navigated to class');
  });

  test('can navigate to home landing page', async function (assert) {
    await visit('/ember-data/2.12');
    await click('[data-test-home]');

    assert.equal(currentURL(), '/ember/release', 'navigated to landing page');
  });
});

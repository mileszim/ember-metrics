import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

module('ahoy adapter', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    sandbox = sinon.createSandbox();
    config = {};
  });

  hooks.afterEach(function() {
    sandbox.restore();
  });

  test('#trackEvent returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:ahoy').create({ config });
    const stub = sandbox.stub(window.ahoy, 'track');
    adapter.trackEvent({
      event: 'Signed Up',
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4
    });
    const expectedArguments = {
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4
    };

    assert.ok(stub.calledWith('Signed Up', expectedArguments), 'track called with proper arguments');
  });

  test('#trackPage returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:ahoy').create({ config });
    const stub = sandbox.stub(window.ahoy, 'trackView');
    adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page'
    });
    const expectedArguments = {
      url: '/my-overridden-page?id=1',
      title: 'my overridden page'
    };

    assert.ok(stub.calledWith(expectedArguments), 'page called with proper arguments');
  });

  test('#trackPage returns the correct response shape', function(assert) {
    const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:ahoy').create({ config });
    const stub = sandbox.stub(window.ahoy, 'trackView');
    adapter.trackPage();

    assert.ok(stub.calledWith(), 'page called with default arguments');
  });
});

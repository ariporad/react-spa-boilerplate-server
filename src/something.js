/**
 * Created by Ari on 8/30/15.
 */
beforeEach(function() {
  console.log('======');
  console.log(this.currentTest.parent.parent);
  console.log('======');
});


describe('something', function() {
  this.pizza = 'ari';
  it('should', () => 0);
});

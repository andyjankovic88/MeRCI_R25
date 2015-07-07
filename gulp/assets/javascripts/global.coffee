#require './vendor/jquery.scrollTo.min.js'
#require './vendor/jquery.ba-throttle-debounce.min.js'
#require './vendor/velocity.min.js'
#require './vendor/rangeslider.js'
#require './vendor/jquery.royalslider.js'
#require './vendor/jquery.payment.js'
#require './vendor/intlTelInput.js'
#require './helpers.js'
#require './effects.js'
#require './flexslider.js'
#require './flow.js'
#require './page-transitions.js'
#require './flow-history.js'
#require './itinerary.js'
#require './multicity.js'
#require './matrix.js'
#require './altflexview.js'
#require './filter.js'
#require './sort.js'
#require './autocomplete.js'
#require './home.js'
#require './tripsummary.js'
#require './payment-page.js'
#require './sharing-overlay.js'
#require './passenger.js'
#require './modals.js'
#reqiore './search/pax-picker.js'

main_class = ->
  # Cache any reusable jQuery selectors
  @$viewport = $('html, body')
  @$window = $(window)
  return

main_class::initPageEvents = ->
  self = this
  # Phone Country Codes
  # https://github.com/Bluefieldscom/intl-tel-input
  $('.phoneCode').intlTelInput defaultCountry: 'auto'
  # Generic Scroll event handler
  @initScrollToEvents()
  # Generic collapse / expand handler
  @initCollapsibleEvents()
  # Modals
  $('.modal-trigger-sign').leanModal
    dismissible: true
    opacity: .5
    in_duration: 300
    out_duration: 200
    ready: ->
      # Callback for Modal open
      return
    complete: ->
      window.location = '/booking'
      return
  # Overlays
  $('.overlay .back-button').click (e) ->
    e.preventDefault()
    $(this).closest('.overlay').removeClass 'active'
    $('body').removeClass 'overlay-active'
    return
  # One-Way / Roundtrip toggle
  $('input[name=triptype]').change (e) ->
    # Round Trip
    if $(this).val() == 'roundtrip'
      $('.dates').removeClass 'one-way'
    else
      $('.dates').addClass 'one-way'
    return
  # Range Sliderss
  $('input[type="range"]').rangeslider
    polyfill: false
    rangeClass: 'rangeslider'
    fillClass: 'rangeslider__fill'
    handleClass: 'rangeslider__handle'
    onInit: ->
    onSlide: (position, value) ->
      $input = $(this)[0].$element
      $container = $input.closest('.input-field')
      if $container.length > 0
        $container.find('.update-value').text value
      return
    onSlideEnd: (position, value) ->
  # Dismissable cards
  $('.dismissable.card .close').click ->
    $(this).closest('.dismissable.card').hide 400
    return
  return

# Generic Collaspse / Expand Handler

main_class::initCollapsibleEvents = ($el) ->
  $('footer.more-info').click ->
    $expandable = $(this).parent().find('.expandable')
    if $expandable.length > 0
      # Toggle the element
      $expandable.slideToggle()
    # Let the footer element know we can change labels
    $(this).toggleClass 'less'
    return
  # Line-item expandable
  $('.line-item').click ->
    $(this).toggleClass('active').next('.breakdown').slideToggle()
    return
  return

# Generic scroll to plugin

main_class::initScrollToEvents = ($el) ->
  # Hold context
  self = this
  # On desktop click, or touchend on mobile, scroll to selected element
  $('[data-to]').on 'click', (e) ->
    selector = $(this).attr('data-to')
    # Sanity check
    if typeof selector == 'undefined' or selector.length < 1
      return
    e.preventDefault()
    # Use speed if specified, otherwise use default
    speed = $(this).attr('speed') or 800
    # Initiate scroll
    self.$viewport.animate { scrollTop: $(selector).offset().top }, speed
    return
  # Stop scrolling animation if the user manually scrolls or touches the screen
  scrollEvents = 'scroll mousedown DOMMouseScroll mousewheel touchMove'
  self.$viewport.on scrollEvents, $.throttle(400, (e) ->
    if e.which > 0 or e.type == 'mousedown' or e.type == 'mousewheel' or e.type == 'touchstart'
      #jptodo : messes with animated scrolling
      #self.$viewport.stop();
    else
    return
  )
  return

$(document).ready ->
  Main = new main_class
  Main.initPageEvents()
  return

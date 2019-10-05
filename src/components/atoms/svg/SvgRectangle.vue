<script>
export default {
  functional: true,
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    rx: {
      type: Number,
      default: 0,
    },
    ry: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 50,
    },
    strokeWidth: {
      type: Number,
      default: 1,
    },
    stroke: {
      type: String,
      default: 'black',
    },
    fill: {
      type: String,
      default: 'none',
    },
    fillOpacity: {
      type: Number,
      default: 1,
    },
    strokeDasharray: {
      type: Number,
      default: 0,
    },
    strokeDashoffset: {
      type: Number,
      default: 0,
    },
  },
  render(h, { props }) {
    return h('rect', {
      attrs: {
        x: props.x,
        y: props.y,
        rx: props.rx,
        ry: props.ry,
        width: props.width,
        height: props.height,
        stroke: props.stroke,
        'stroke-width': props.strokeWidth,
        fill: props.fill,
        'fill-opacity': props.fillOpacity,
        'stroke-dasharray': props.strokeDasharray,
        'stroke-dashoffset': props.strokeDashoffset,
      },
    })
  },
}
</script>

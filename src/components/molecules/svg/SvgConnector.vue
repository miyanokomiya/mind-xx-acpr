<script>
function opposite({ sx, ex }) {
  return sx > ex
}

function qx({ sx, ex }) {
  if (opposite({ sx, ex })) {
    return (sx * 3) / 10 + (ex * 7) / 10
  } else {
    return (sx * 7) / 10 + (ex * 3) / 10
  }
}

function qy({ sy, ey }) {
  return (sy * 1) / 10 + (ey * 9) / 10
}

function d({ sx, sy, ex, ey, curve }) {
  if (curve) {
    return `M ${sx} ${sy} Q ${qx({ sx, ex })} ${qy({ sy, ey })} ${ex} ${ey}`
  } else {
    if (opposite({ sx, ex })) {
      return `M ${sx} ${sy} L ${sx - 20} ${sy} L ${sx - 20} ${ey} L ${ex} ${ey}`
    } else {
      return `M ${sx} ${sy} L ${sx + 20} ${sy} L ${sx + 20} ${ey} L ${ex} ${ey}`
    }
  }
}

export default {
  functional: true,
  props: {
    sx: {
      type: Number,
      required: true,
    },
    sy: {
      type: Number,
      required: true,
    },
    ex: {
      type: Number,
      required: true,
    },
    ey: {
      type: Number,
      required: true,
    },
    curve: {
      type: Boolean,
      default: false,
    },
  },
  render(h, { props }) {
    return h('path', {
      attrs: {
        stroke: 'black',
        'stroke-width': 1,
        fill: 'none',
        d: d(props),
      },
    })
  },
}
</script>

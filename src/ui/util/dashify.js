import is from 'is-explicit'

/******************************************************************************/
// Main
/******************************************************************************/

function dashify (str) {

  if (is.string(this))
    str = this

  return str && str
    .toLowerCase()
    .replace(/\s/g, '-')
    .replace(/-+/g, '-')

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default dashify
function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  req.flash('error', 'You must login')
  res.redirect("/");
  next()
}

module.exports = {
  checkAuthenticated
}

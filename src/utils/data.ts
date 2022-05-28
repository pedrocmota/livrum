export const filter = (search: string, table: any) => {
  const tr = table.getElementsByTagName('tr')
  for (let i = 0; i < tr.length; i++) {
    if (tr[i].parentElement.nodeName != 'THEAD') {
      let tds = tr[i].getElementsByTagName('td')
      let flag = false
      for (let j = 0; j < tds.length; j++) {
        const td = tds[j]
        if (td.innerHTML.toUpperCase().indexOf(search.toUpperCase()) > -1) {
          flag = true
        }
      }
      if (flag) {
        tr[i].style.display = ''
      }
      else {
        tr[i].style.display = 'none'
      }
    }
  }
}

export const validateEmail = (email: string) => {
  if (email.length <= 0) return false
  var regex = /\S+@\S+\.\S+/
  return regex.test(email)
}

export const treatName = (fullName: string) => {
  const lowercase = fullName.toLowerCase()
    .split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
  const splited = lowercase.split(' ')
  if (splited.length === 1) {
    return {
      fullName: lowercase,
      firstName: lowercase,
      lastName: ''
    }
  } else {
    return {
      fullName: lowercase,
      firstName: splited[0],
      lastName: splited[splited.length - 1]
    }
  }
}
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'hvgpoifmqrddge',
  host: 'ec2-52-71-231-180.compute-1.amazonaws.com',
  database: 'dfp9ven4n627qb',
  password: '6624f255a92e17dc7def17d25a5279321e7c7d09217283dc56e0ace49fcdfdec',
  port: 5432,
  ssl: {
      rejectUnauthorized : false
}
})
//get all categories
const getCategories = (request, response) => {
  pool.query('SELECT * FROM categories', (error, results) => {
    if (error) {
      return res.send('Error in query');
      throw error;
    }
    return (results.rows[0]);
  })
}
//get specific user
function getCategoryByname(request, response, id) {
  pool.query('SELECT * FROM categories WHERE category_name = $1', [id], (error, results) => {
    if (error) {
      throw error
      return res.send('Error in query');
    }
    return results.rows[0];
  })

}
//post a new user
const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO categories (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}
//put updated data into a existing user
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE categories SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}
//delete a user
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM categories WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
module.exports = {
  getCategories,
  getCategoryByname,
  createUser,
  updateUser,
  deleteUser,
}

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'nx0329',
  port: 5432,
})

//get all users
const getUsers = (request, response) => {
  pool.query('SELECT * FROM books ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
//get a specific user
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const getBookByTitle = (book_title1) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM books WHERE book_title = $1', [book_title1], (error, results) => {
    if (error) {
      throw error
    }
    return results.rows;
  })

}

//post a new user
const createUser = (request, response, book_public_id, additional_photo_ids) => {
  var raw_info_set = request.body;
  var book_title  =raw_info_set['book_title'];
  var price_before  =raw_info_set['price_before'];
  var price_after  =raw_info_set['price_after'];
  var grade  =raw_info_set['grade'];
  var how_harmed  =raw_info_set['how_harmed'];
  var harm_etc  =raw_info_set['harm_etc'].trim();
  var how_solved  =raw_info_set['how_solved'];
  var solved_etc  =raw_info_set['solved_etc'].trim();
  var etc_info  =raw_info_set['etc_info'].trim();
  var uploader_name  =raw_info_set['uploader_name'];
  var first_cat  =raw_info_set['first_cat'];
  var second_cat  =raw_info_set['second_cat'];
  pool.query(`INSERT INTO books (book_title, price_before,price_after,grade, how_harmed, harm_etc,how_solved, solved_etc,etc_info,uploader_name, book_public_id, first_cat, second_cat, title_tokens,additional_photo_ids)
                         VALUES ( $1,$2 ,$3,$4,$5,$6,$7,$8,$9,$10, $11, $12, $13, to_tsvector($14),$15)`,
                         [book_title, price_before,price_after,grade, how_harmed, harm_etc,how_solved, solved_etc,etc_info,uploader_name, book_public_id, first_cat,second_cat,book_title,additional_photo_ids], (error, results) => {
    if (error) {
      throw error
    }
  })
}
//put updated data into a existing user
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
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

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

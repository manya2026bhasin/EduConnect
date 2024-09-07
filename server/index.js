import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // Parses JSON requests
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

let data;
app.post('/api/login', async (req, res) => {
    data = req.body;
    console.log('Data received:', data);
    try {
        const client = await pool.connect();


        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [req.body["email"]];

        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            if (user.passwords === req.body["password"]) {
                const token = jwt.sign(
                    { email: req.body["email"] }, // Embed the email in the payload
                    process.env.JWT_SECRET, // Replace with your actual secret key
                    { expiresIn: '1h' } // Set token expiry
                );
                res.status(200).json({ message: 'Login successful', token });
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        } else {
            res.status(401).json({ message: 'email not found' });
        }

        client.release();
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal server error');
    }

});

app.post('/api/signup', async (req, res) => {
    data = req.body;
    console.log('Data received:', data);
    try {

        const client = await pool.connect();
        const query2 = 'SELECT * FROM users WHERE username = $1';
        const values2 = [req.body["email"]];

        const result2 = await client.query(query2, values2);

        if (result2.rows.length > 0) {
            res.status(401).json({ message: "email already exists" });
        }
        else {
            const query = 'INSERT INTO users (username, passwords) VALUES ($1, $2)';
            // const values = [grades, remark, fileInput];
            const values = [req.body["email"], req.body["password"]];

            await client.query(query, values);
            res.status(200).json({ message: "Account created" });

        }

        client.release();
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal server error');
    }

});

app.get('/api/emailgroups', async (req, res) => {
    try {
        const { email } = req.query;
        const client = await pool.connect();
        const query = `SELECT gi.id, gi.gname, gi.description
                       FROM groups_info gi
                       JOIN user_groups ug ON gi.id = ug.group_id
                       JOIN users u ON u.username = ug.username
                       WHERE u.username = $1;`;
        const values = [email];
        const result = await client.query(query, values);
        console.log(result);
        client.release();

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving groups:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/groups/details', async (req, res) => {
    const groupId = req.query.groupId; // Get group_id from query parameters
    console.log(`Fetching details for group_id: ${groupId}`);

    try {
        const client = await pool.connect();
        console.log(`Executing query to fetch group details where id = ${groupId}`);

        const result = await client.query('SELECT * FROM groups_info WHERE id = $1', [groupId]);

        client.release();

        if (result.rows.length === 0) {
            console.error(`Group with id ${groupId} not found`);
            return res.status(404).json({ message: 'Group not found' });
        }

        console.log(`Group details found: ${JSON.stringify(result.rows[0])}`);
        res.status(200).json({ group: result.rows[0] });
    } catch (error) {
        console.error('Error fetching group details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/groups', async (req, res) => {
    const { name, description, members } = req.body; // Extract members if needed
    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO groups_info (gname, description) VALUES ($1, $2) RETURNING id',
            [name, description]
        );
        const groupId = result.rows[0].id;
        for (let i = 0; i < members.length; i++) {
            const result2 = await client.query(
                'INSERT INTO user_groups (group_id,username) VALUES ($1,$2)',
                [groupId, members[i]]
            );
        }
        client.release();

        res.status(201).json({ message: 'Group created successfully', groupId });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/checkUser', async (req, res) => {
    try {
        const { email } = req.query;
        const client = await pool.connect();

        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [email];
        const result = await client.query(query, values);

        client.release();

        if (result.rows.length > 0) {
            // User exists
            res.status(200).json({ exists: true });
        } else {
            // User does not exist
            res.status(404).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).send('Internal server error');
    }
});


app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

SELECT
	SUBSTRING(
		t1.text,
		INSTR(t1.text, '{text}'),
		{textLength}
	) AS text,
	t2.filename,
	t2.filepath,
	mimetype
FROM
	(
		SELECT
			MATCH (utf8segments) AGAINST ('{keyword}') AS score,
			text,
			fileversion_id
		FROM
			filefulltext
	) t1
JOIN fileversion t2 ON (t1.fileversion_id = t2.id)
WHERE
	t1.score > 0
ORDER BY
	t1.score DESC
LIMIT {offset},
 {limit}
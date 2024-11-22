CREATE TABLE IF NOT EXISTS public.users
(
    id BIGSERIAL PRIMARY KEY,  
    email text COLLATE pg_catalog."default" NOT NULL,
    encrypted_password text COLLATE pg_catalog."default",
    name text COLLATE pg_catalog."default" NOT NULL,
    surname text COLLATE pg_catalog."default" NOT NULL,
    age integer NOT NULL,
    date timestamp without time zone NOT NULL DEFAULT now(),
    description text COLLATE pg_catalog."default",
    isroot boolean DEFAULT false,
    image text COLLATE pg_catalog."default"
);
CREATE TABLE IF NOT EXISTS public.posts
(
    id BIGSERIAL PRIMARY KEY,
    owner_id integer NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    body text COLLATE pg_catalog."default" NOT NULL,
    date timestamp without time zone NOT NULL DEFAULT now(),
    private boolean NOT NULL DEFAULT false,
    image text COLLATE pg_catalog."default",
    CONSTRAINT posts_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
CREATE TABLE IF NOT EXISTS public.comments
(
    id BIGSERIAL PRIMARY KEY,
    owner_id integer NOT NULL,
    post_id integer NOT NULL,
    body text COLLATE pg_catalog."default" NOT NULL,
    date timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT comments_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
CREATE TABLE IF NOT EXISTS public.friends
(
    id BIGSERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    friend_id integer NOT NULL,
    CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
CREATE TABLE IF NOT EXISTS public.invites
(
    id BIGSERIAL PRIMARY KEY,
    to_id integer NOT NULL,
    from_id integer NOT NULL,
    date timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT invites_from_id_fkey FOREIGN KEY (from_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT invites_to_id_fkey FOREIGN KEY (to_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
CREATE OR REPLACE FUNCTION public.delete_comments_on_post_delete()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    -- Удаляем все комментарии, связанные с удаляемым постом
    DELETE FROM comments WHERE post_id = OLD.id;
    RETURN OLD;
END;
$BODY$;
CREATE OR REPLACE TRIGGER trigger_delete_comments
    BEFORE DELETE
    ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.delete_comments_on_post_delete();

CREATE OR REPLACE PROCEDURE public.addfriend(
	IN a integer,
	IN b integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
DELETE FROM invites WHERE (from_id = b AND to_id = a)OR(from_id = a AND to_id = b);
INSERT INTO friends(user_id, friend_id) VALUES (a, b);
INSERT INTO friends(user_id, friend_id) VALUES (b, a);
END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.deleteinvite(
	IN a integer,
	IN b integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
DELETE FROM invites WHERE from_id = a AND to_id = b;
DELETE FROM invites WHERE from_id = b AND to_id = a;
END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.isfriends(
	IN a integer,
	IN b integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
SELECT COUNT(*) FROM friends WHERE user_id IN (a, b) AND friend_id IN (a, b); 
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.get_user_friends(
	c_user_id integer)
    RETURNS TABLE(id bigint, email text, age integer, name text, surname text, description text, image text, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
        u.id, 
        u.email, 
        u.age, 
        u.name, 
        u.surname, 
        u.description, 
        u.image, 
        CAST(COUNT(*) OVER() AS INT) AS total_count
    FROM 
        friends f
    JOIN 
        users u ON u.id = f.friend_id
    WHERE 
        f.user_id = c_user_id 
        AND u.id != c_user_id;
END;
$BODY$;
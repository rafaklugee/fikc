PGDMP  "                    }            fikc_db #   16.6 (Ubuntu 16.6-0ubuntu0.24.04.1) #   16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)     b           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            c           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            d           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            e           1262    16388    fikc_db    DATABASE     s   CREATE DATABASE fikc_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'pt_BR.UTF-8';
    DROP DATABASE fikc_db;
                postgres    false            f           0    0    DATABASE fikc_db    ACL     (   GRANT ALL ON DATABASE fikc_db TO admin;
                   postgres    false    3429                        3079    24592 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            g           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    24612 	   postagens    TABLE       CREATE TABLE public.postagens (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    descricao character varying(255) NOT NULL,
    conteudo character varying(255) NOT NULL,
    data timestamp with time zone
);
    DROP TABLE public.postagens;
       public         heap    postgres    false            �            1259    24611    postagens_id_seq    SEQUENCE     �   CREATE SEQUENCE public.postagens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.postagens_id_seq;
       public          postgres    false    219            h           0    0    postagens_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.postagens_id_seq OWNED BY public.postagens.id;
          public          postgres    false    218            �            1259    24581    usuarios    TABLE     5  CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    eadmin integer DEFAULT 0,
    senha character varying(255) NOT NULL,
    client_id uuid DEFAULT public.uuid_generate_v4(),
    drive_link character varying(255)
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false    2            �            1259    24580    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public          postgres    false    217            i           0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public          postgres    false    216            �           2604    24615    postagens id    DEFAULT     l   ALTER TABLE ONLY public.postagens ALTER COLUMN id SET DEFAULT nextval('public.postagens_id_seq'::regclass);
 ;   ALTER TABLE public.postagens ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    24584    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217            _          0    24612 	   postagens 
   TABLE DATA           P   COPY public.postagens (id, titulo, slug, descricao, conteudo, data) FROM stdin;
    public          postgres    false    219   %       ]          0    24581    usuarios 
   TABLE DATA           Y   COPY public.usuarios (id, nome, email, eadmin, senha, client_id, drive_link) FROM stdin;
    public          postgres    false    217   �       j           0    0    postagens_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.postagens_id_seq', 16, true);
          public          postgres    false    218            k           0    0    usuarios_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.usuarios_id_seq', 22, true);
          public          postgres    false    216            �           2606    24619    postagens postagens_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.postagens
    ADD CONSTRAINT postagens_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.postagens DROP CONSTRAINT postagens_pkey;
       public            postgres    false    219            �           2606    24591    usuarios usuarios_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
       public            postgres    false    217            �           2606    24589    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    217            _   v   x�34���/�LILIU��W�-�K�WH�/V�KM?�99�242�̃����/�J�d8]����/�W �05Ũ�9�Ss�z�FF��F�F
��V�V&�z��f��\1z\\\ (�0      ]   2  x�5��n�@ ����.�s��VS��#Jb����T`H�m�,}�j�.��9qA��~0��d�<�:<�/�(�L] C�	��(�Ϻs$V��TN�l�Id3\-�"�������tg?��]mOuA���)���0�-���q(��G�k{ܧ8��m����B*���1��������.�����VQ�@�lbs��M�Ӹ��<@�Z�h���I2LZ��m�� ���#��"�$c�ض�B�.:a�J�x��H#��*��Dv�u�p�Wתڐ]{	�E��o�@%S�`��x?o�     
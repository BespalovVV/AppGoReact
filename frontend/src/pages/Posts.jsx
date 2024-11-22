import React, { useEffect, useState } from 'react';
import '../styles/App.css'
import PostList from '../components/PostList';
import MyButton from '../components/UI/button/MyButton';
import PostForm from '../components/PostForm/PostForm';
import PostFilter from '../components/PostFilter';
import MyModal from '../components/UI/Modal/MyModal';
import { usePosts } from '../hooks/usePosts';
import PostService from '../API/PostService';
import MyLoading from '../components/UI/Loader/MyLoading';
import { useFetching } from '../hooks/useFetching';


function Posts() {
    const [posts, setPosts] = useState([])

    const [filter, setFilter] = useState({ sort: '', query: '' })

    const [modal, setModal] = useState(false)

    const [totalCount, setTotalCount] = useState(0);

    const [limit, setLimit] = useState(10);

    const [page, setPage] = useState(1);

    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

    const [fetchPosts, isPostLoading, postError] = useFetching(async () => {
        const response = await PostService.getAll();
        setPosts(response.data)
        setTotalCount(response.headers['x-total-count'])
    })

    useEffect(
        () => {
            fetchPosts()
        }, [])

    const createPost = () => {
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    return (
        <div className='App'>
            <MyButton className='green' style={{marginTop: '20px'}} onClick={() => setModal(true)} >
                Создать пост
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm createPost={createPost} />
            </MyModal>
            <hr style={{ margin: '15px 0' }} />
            <PostFilter filter={filter} setFilter={setFilter} />
            {postError &&
                <h1>Произошла ошибка {postError}</h1>
            }
            {isPostLoading
                ? <div style={{ display: "flex", justifyContent: "center", marginTop: "190px" }}>
                    <MyLoading />
                </div>
                : <PostList remove={removePost} posts={sortedAndSearchedPosts} />
            }
        </div>
    );
}

export default Posts;

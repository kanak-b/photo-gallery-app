

class PhotoGallery{
    constructor(){

        this.API_KEY = "";
        this.gallerydiv = document.querySelector('.gallery');
        this.searchform = document.querySelector('.header form');
        this.loadmore = document.querySelector('.load-more');
        this.logo = document.querySelector('.logo');
        this.pageindex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
        

    }

    eventHandle(){

        document.addEventListener('DOMContentLoaded', () => {
            this.getimg(1);
        });
        this.searchform.addEventListener('submit', (e) => {
            this.pageindex = 1;
            this.getsearchedimages(e);

        });
        this.loadmore.addEventListener('click', (e) => {
            this.loadmoreimages(e);
        });
        this.logo.addEventListener('click', () => {
            this.pageindex = 1;
            this.gallerydiv.innerHTML = '';
            this.getimg(this.pageindex);

        })
    }

    async getimg(index){
        this.loadmore.setAttribute('data-img','curated');
        const baseurl = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchimages(baseurl);
        this.GenerateHTML(data.photos)
        console.log(data)
    }

    async fetchimages(baseurl){
        const response = await fetch(baseurl, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        return data;
        
    }

    GenerateHTML(photos){
        photos.forEach(photo => {

            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
            <a href = "${photo.src.original}" target = "_blank">
            <img src="${photo.src.medium}">
            <h3>${photo.photographer}</h3>
            </a>
            `;
            this.gallerydiv.appendChild(item)
        })
    }

    async getsearchedimages(e){
        this.loadmore.setAttribute('data-img', 'search');
        e.preventDefault();
        this.gallerydiv.innerHTML="";
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue; 
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`;
        const data = await this.fetchimages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }

    async getmoresearchedimages(index){
        
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`;
        const data = await this.fetchimages(baseURL);
        this.GenerateHTML(data.photos);
    }

    loadmoreimages(e){
        let index = ++this.pageindex;
        const loadmoredata = e.target.getAttribute('data-img');
        if (loadmoredata === "curated"){

            this.getimg(index)

            //load page 2 for curated
        }else{

            this.getmoresearchedimages(index);

            //load page 2 for search

        }
    }
}

const gallery = new PhotoGallery;
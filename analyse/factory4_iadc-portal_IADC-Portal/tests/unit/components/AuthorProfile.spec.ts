import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import AuthorProfile from '@/components/AuthorProfile.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('AuthorProfile.vue', () => {
  let wrapper;
  let localVue;
  const name = 'My Name';
  const nameDeactivated = 'My Name (Deactivated)';
  const image = 'https://this.image.is';

  beforeEach(async () => {
    localVue = createLocalVue();
    wrapper = shallowMount(AuthorProfile, {
      localVue,
      vuetify: new Vuetify(),
    });
    await wrapper.setProps({
      name,
      image,
    });
  });

  afterEach(() => {
    wrapper?.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should init data', () => {
    expect(wrapper.vm.name).toBe(name);
    expect(wrapper.vm.nameNormalized).toBe(name);
    expect(wrapper.vm.image).toBe(image);
  });

  it('should normalize name', async () => {
    await wrapper.setProps({ name: nameDeactivated, image });
    expect(wrapper.vm.nameNormalized).not.toBe(nameDeactivated);
    expect(wrapper.vm.name).toBe(nameDeactivated);
    expect(wrapper.vm.nameNormalized).toBe('My Name');
    expect(wrapper.vm.image).toBe(image);
  });

  it('should display image and author name', () => {
    expect(wrapper.find('p.author__section-name').text()).toBe('My Name');
    const img = wrapper.find('.author__section-image');

    expect(img.props('src')).toBe(image);
    expect(img.props('alt')).toBe(name);
  });

  it('should display image and author name normalized', async () => {
    await wrapper.setProps({ name: nameDeactivated, image });
    expect(wrapper.find('p.author__section-name').text()).toBe('My Name');
    const img = wrapper.find('.author__section-image');

    expect(img.props('src')).toBe(image);
    expect(img.props('alt')).toBe(nameDeactivated);
  });
});

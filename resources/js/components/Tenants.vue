<script>
export default {
    data: function () {
        return {
            adminEmail: "",
            adminName: "",
            domain: "",
            name: "",
            tenants: [],
        };
    },

    created: function () {
        this.getTenants();
    },

    methods: {
        createTenant: function () {
            var self = this;

            axios.post("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants", {
                    adminEmail: this.adminEmail,
                    adminName: this.adminName,
                    domain: this.domain,
                    name: this.name,
                })
                .then(function (response) {
                    self.$toasted.show("Tenant successfully created.", {type: "success"});
                    self.tenants = Object.assign([], self.tenants, response.data);
                    window.location.href = "//" + response.data.domain + "/dashboard/tenants";
                })
                .catch(function (error) {
                    console.error(error, error.response);
                    self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, {type: "error"});
                });
        },

        deleteTenant: function (id) {
            var self = this;

            axios.delete("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants/" + id)
                .then(function (response) {
                    self.$toasted.show("Tenant successfully deleted.", {type: "success"});

                    if (response.status == 204) {
                        var tenants = _.reject(self.tenants, function (tenant) {
                            return tenant.id == id;
                        });
                        self.tenants = Object.assign([], tenants);
                    }
                })
                .catch(function (error) {
                    console.error(error, error.response);
                    self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, {type: "error"});
                });
        },

        getTenants: function () {
            var self = this;

            axios.get("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants")
                .then(function (response) {
                    self.tenants = Object.assign([], response.data);
                })
                .catch(function (error) {
                    console.error(error, error.response);
                    self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, {type: "error"});
                });
        },

        isCurrentTenant: function (domain) {
            return domain == window.location.hostname;
        },

        isNotCurrentTenant: function (domain) {
            return ! this.isCurrentTenant(domain);
        },
    }
};
</script>

<template>
    <div>
        <h1>Tenant Management</h1>

        <div class="relative">
            <h2 class="mb-3 text-90 font-normal text-2xl">Add Tenant</h2>
            <div class="card overflow-hidden">
                    <div>
                        <div class="flex border-b border-40" via-resource="" via-resource-id="" via-relationship="">
                            <div class="w-1/5 py-6 px-8">
                                <label class="inline-block text-80 pt-2 leading-tight"
                                    for="name"
                                >
                                    Tenant
                                </label>
                            </div>
                            <div class="py-6 px-8 w-1/2">
                                <input id="name"
                                    type="text"
                                    placeholder="Name"
                                    class="w-full form-control form-input form-input-bordered"
                                    v-model="name"
                                >
                                <div class="help-text help-text mt-2"></div>
                                <input id="domain"
                                    type="text"
                                    placeholder="Domain"
                                    class="w-full form-control form-input form-input-bordered"
                                    v-model="domain"
                                >
                                <div class="help-text help-text mt-2"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="flex border-b border-40">
                            <div class="w-1/5 py-6 px-8">
                                <label class="inline-block text-80 pt-2 leading-tight"
                                    for="adminEmail"
                                >
                                    Admin
                                </label>
                            </div>
                            <div class="py-6 px-8 w-1/2">
                                <input id="adminEmail"
                                    type="text"
                                    placeholder="Email"
                                    class="w-full form-control form-input form-input-bordered"
                                    v-model="adminEmail"
                                >
                                <div class="help-text help-text mt-2"></div>
                                <input id="adminName"
                                    type="text"
                                    placeholder="First & Last Name"
                                    class="w-full form-control form-input form-input-bordered"
                                    v-model="adminName"
                                >
                                <div class="help-text help-text mt-2"></div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-30 flex px-8 py-4 pb-1">
                        <div class="w-1/5 py-6 px-8"></div>
                        <button class="ml-4 btn btn-default btn-primary"
                            @click="createTenant"
                        >
                            Create Tenant
                        </button>
                    </div>
            </div>
        </div>

        <div class="card relative mt-8">
            <div class="overflow-hidden overflow-x-auto relative">
                <table cellpadding="0" cellspacing="0" data-testid="resource-table" class="table w-full">
                    <thead>
                        <tr>
                            <th class="text-left">
                                Name
                            </th>
                            <th class="text-left">
                                URL
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="tenant in tenants"
                            :key="tenant.id"
                        >
                            <td>
                                <span class="whitespace-no-wrap text-left">
                                    {{ tenant.name }}
                                </span>
                            </td>
                            <td>
                                <span class="whitespace-no-wrap text-left">
                                    {{ tenant.domain }}
                                </span>
                            </td>
                            <td class="td-fit text-right pr-6">
                                <router-link
                                    tag="span"
                                    :to="{path: '/resources/tenants/' + tenant.id + '?viaResource=&viaResourceId=&viaRelationship='}"
                                    class="cursor-pointer text-70 hover:text-primary mr-3"
                                >
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        class="fill-current text-grey"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        height="20"
                                        width="20"
                                    >
                                        <path d="M224 96.1v48.8l29.7 29.7c-6.8-34.8 3.5-70.3 28.5-95.3 20.3-20.3 47.2-31.2 75-31.2h1.2L301 105.3l15.1 90.6 90.6 15.1 57.3-57.3c.3 28.3-10.6 55.5-31.2 76.1-9.3 9.3-20.2 16.4-31.8 21.6 1.8 1.6 3.9 2.9 5.6 4.6l30.7 30.7c10.5-6.3 20.5-13.9 29.4-22.9 38.1-38.1 53.7-94.3 40.7-146.6C504.4 105 495 95.4 483 92c-12.2-3.4-25.2.1-34 9l-58.7 58.6-32.4-5.4-5.4-32.4 58.6-58.6c8.9-8.9 12.3-21.9 8.9-34-3.3-12.1-13-21.5-25.2-24.5-53.2-13.2-107.9 2-146.6 40.6C238 55.5 229.7 67 222.9 79.2l1.1.8v16.1zM106 454c-12.8 12.8-35.3 12.8-48.1 0-6.4-6.4-10-15-10-24 0-9.1 3.5-17.6 10-24l134.4-134.4-33.9-33.9L24 372C8.5 387.5 0 408.1 0 430s8.5 42.5 24 58 36.1 24 58 24 42.5-8.5 58-24l100.9-100.9c-9.7-15.8-15.2-33.8-15.7-52.1L106 454zm395.1-58.3L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7z"></path>
                                    </svg>
                                </router-link>
                                <span v-if="isNotCurrentTenant(tenant.domain)">
                                    <a :href="'//' + tenant.domain + '/dashboard/tenants'"
                                        class="cursor-pointer text-70 hover:text-primary mr-3"
                                        title="Switch"
                                    >
                                        <svg
                                            class="fill-current text-grey"
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                            height="20"
                                            width="20"
                                        >
                                            <path d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128 70.741 0 128 57.249 128 128 0 70.741-57.249 128-128 128-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128 0 70.74-57.249 128-128 128z"></path>
                                        </svg>
                                    </a>
                                </span>
                                <span v-if="isCurrentTenant(tenant.domain)"
                                    class="mr-3"
                                >
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        class="fill-current text-grey"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                        height="20"
                                        width="20"
                                    >
                                        <path d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 336c-79.6 0-144-64.4-144-144s64.4-144 144-144 144 64.4 144 144-64.4 144-144 144z"></path>
                                    </svg>
                                </span>
                                <button title="Delete"
                                    class="appearance-none cursor-pointer text-70 hover:text-danger mr-3"
                                    @click="deleteTenant(tenant.id)"
                                >
                                    <svg
                                        class="fill-current text-grey"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        height="20"
                                        width="20"
                                    >
                                        <path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path>
                                    </svg>
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style>
/* Scoped Styles */
</style>

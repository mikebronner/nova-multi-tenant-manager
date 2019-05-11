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

            axios.post("/nova-vendor/tenants", {
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

            axios.delete("/nova-vendor/tenants/" + id)
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

            axios.get("/nova-vendor/tenants")
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
                                <a :href="'//' + tenant.domain + '/dashboard/site-settings'"
                                    class="cursor-pointer text-70 hover:text-primary mr-3"
                                    title="Site Settings"
                                >
                                    <i class="fas fa-tools"></i>
                                </a>
                                <span v-if="isNotCurrentTenant(tenant.domain)">
                                    <a :href="'//' + tenant.domain + '/dashboard/tenants'"
                                        class="cursor-pointer text-70 hover:text-primary mr-3"
                                        title="Switch"
                                    >
                                        <i class="fal fa-toggle-off"></i>
                                    </a>
                                </span>
                                <span v-if="isCurrentTenant(tenant.domain)"
                                    class="mr-3"
                                >
                                    <i class="far fa-toggle-on"></i>
                                </span>
                                <button title="Delete"
                                    class="appearance-none cursor-pointer text-70 hover:text-primary mr-3"
                                    @click="deleteTenant(tenant.id)"
                                >
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
